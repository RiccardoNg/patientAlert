#!/bin/bash

MAIN=/home/deptraisatthu/lamviec/adcoffee/01-wordcloudProject
vwinfo=/home/deptraisatthu/lamviec/vw/utl/vw-varinfo
SparkSubmit=/home/deptraisatthu/spark/bin/spark-submit

ProjectName=$1
#MAIN=$2

ExtractCsv=$MAIN/00-extractCsv/extractCsv.py
Rekognition=$MAIN/01-rekognition/rekognition.py
Dcolor=$MAIN/02-dcolor/dominantColor.py
Tokenize=$MAIN/03-tokenize/vn.vitk-3.0.jar
vitk=$MAIN/03-tokenize/vn.vitk-3.0.jar
Regex=$MAIN/03-tokenize/RegexOnlyCsv.jar
RegexImage=$MAIN/03-tokenize/RegexOnlyCsv.jar
DataFolder=$MAIN/data/$ProjectName

mkdir $DataFolder
cp $MAIN/data/$ProjectName.csv $DataFolder


MesExtract=$MAIN/04-WordCloudSuggestion/mesExtract.py
Pandas2json=$MAIN/04-WordCloudSuggestion/pandas2json.py
CreateCloud=$MAIN/04-WordCloudSuggestion/createCloud.py

Target=$DataFolder/$ProjectName





cd $MAIN
pwd
ls
mkdir $DataFolder/pictures
mkdir $DataFolder/PictureFormat
cp $MAIN/data/PictureFormat/* $DataFolder/PictureFormat
# tao file data-originalplus them ""
# python extract
python $ExtractCsv $ProjectName $DataFolder
# replace "" -> null
# TODO dung luon regex only

java -jar $Regex $ProjectName.02-description.csv $DataFolder
java -jar $Regex $ProjectName.02-position.csv $DataFolder
java -jar $Regex $ProjectName.02-platform.csv $DataFolder
java -jar $Regex $ProjectName.02-callToAction.csv $DataFolder
java -jar $Regex $ProjectName.02-message.csv $DataFolder


java -jar $Regex $ProjectName.02-image.csv $DataFolder

# # python dcolor
python $Dcolor $ProjectName $DataFolder
# # python rekognition
python $Rekognition $ProjectName $DataFolder
# python /home/deptraisatthu/lamviec/adcoffee/00-mainProject/01-rekognition/rekognition.py 001 /home/deptraisatthu/lamviec/adcoffee/00-mainProject/dataSanpham/resultver10
# # python regex
# java -jar $Regex $ProjectName.03-dcolor.csv $DataFolder
# java -jar $Regex $ProjectName.04-rekognition.csv $DataFolder
# # java tokenize vitk
$SparkSubmit $vitk -i $Target.02-message.csv.Regex -o $Target.02-messageTokenize
cat $Target.02-messageTokenize/part* > $Target.05-messageTokenize.csv

# 6- train vs vw-varinfonhat
#them dau dong
sed -e 's/^/|agemax /' $Target.02-agemax.csv > $Target.Final.02-agemax.csv
sed -e 's/^/|agemin /' $Target.02-agemin.csv > $Target.Final.02-agemin.csv
sed -e 's/^/|description /' $Target.02-description.csv.Regex > $Target.Final.02-description.csv
sed -e 's/^/|platform /' $Target.02-platform.csv.Regex > $Target.Final.02-platform.csv
sed -e 's/^/|position /' $Target.02-position.csv.Regex > $Target.Final.02-position.csv
sed -e 's/^/|callToAction /' $Target.02-callToAction.csv.Regex > $Target.Final.02-callToAction.csv
# sed -e 's/^/|dcolor /' $Target.03-dcolor.csv > $Target.Final.03-dcolor.csv
# sed -e 's/^/|recognize /' $Target.04-rekognition.csv > $Target.Final.04-rekognition.csv
sed -e 's/^/|message /' $Target.05-messageTokenize.csv > $Target.Final.05-messageTokenize.csv
paste -d' ' $Target.02-ctr.csv $Target.Final.02-agemax.csv $Target.Final.02-agemin.csv $Target.Final.02-platform.csv $Target.Final.02-position.csv $Target.03-dcolor.csv $Target.04-rekognition.csv $Target.Final.05-messageTokenize.csv $Target.Final.02-callToAction.csv > $Target.vw
# $Target.Final.02-description.csv
# shuffle
cat $Target.vw | while IFS= read -r f; do printf "%05d %s\n" "$RANDOM" "$f"; done | sort -n | cut -c7- > $Target.shuffle.vw

lengthHead=30000
lengthTail=10000
head -$lengthHead $Target.shuffle.vw > $Target.train.vw
tail -$lengthTail $Target.shuffle.vw > $Target.test.vw
# train with vw
$vwinfo $Target.train.vw > $Target.train.info 
# create message wordcloud
python $MesExtract $ProjectName $DataFolder
python $Pandas2json $ProjectName $DataFolder
python $CreateCloud $ProjectName $DataFolder
