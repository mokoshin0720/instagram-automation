function insight_reporting(){
    var date = new Date();
    
    require('dotenv').config();
    const {SSID} = process.env;
    const {INSTAGRAMID} = process.env;
    const {USERNAME} = process.env;
    const {ACCESSTOKEN} = process.env;
  
    //instagram数値記録用のスプレットシートID
    var SSId = SSID;
  
    //instagram Graph API 必要情報
    var instragramID = INSTAGRAMID;
    var username = USERNAME;
    var ACCESS_TOKEN = ACCESSTOKEN;
    getInsight(date,SSId,instragramID,username,ACCESS_TOKEN);
    }
    
   
    //instagramの数値を引っ張り記録する関数
    function getInsight(date,SSId,instragramID,username,ACCESS_TOKEN) {
    
   
    var mySS = SpreadsheetApp.openById(SSId); //IDでスプレッドシートを開く
    var sheetName = 'Contents'; //スプレッドシートのContentsのシートを参照
    var sheet = mySS.getSheetByName(sheetName);
    
   
    //日付を取得して1日前に戻す
    var today = Utilities.formatDate(date, 'Tokyo/Asia', 'yyyy/MM/dd');
    
   
    //現在の「日」を取得
    var day = date.getDate();
    
   
    //前日日付にしたいので-1する
    date.setDate(day-1);
    
   
    //日付の表示形式を整形する
    var yesterday = Utilities.formatDate(date, 'JST', 'yyyy/MM/dd');
    
   
   var facebook_url = 'https://graph.facebook.com/v8.0/'+ instragramID +'/insights?metric=reach,impressions,profile_views&period=day&access_token='+ ACCESS_TOKEN;;
    
   
    var encodedURI = encodeURI(facebook_url);
    var response = UrlFetchApp.fetch(encodedURI); //URLから情報を取得
    var jsonData = JSON.parse(response);//JSONデータをパース
    var reach = jsonData.data[0].values[1].value;
    var impressions = jsonData.data[1].values[1].value;
    var profile_views = jsonData.data[2].values[1].value;
    
   
    //シートにデータを追加またはアップデート
    var newData =[yesterday,reach,impressions,profile_views];
    insertOrUpdate2(sheet, newData);
    }
    
   
    //行の存在に応じて追加もしくは更新を行う関数
    function insertOrUpdate2(sheet, data) {
    var row = findRow2(sheet, data[0]);//日付比較の関数、行番号を受け取る
    if (row) { // 行が見つかったら更新
    sheet.getRange(row, 1, 1, data.length).setValues([data]);
    } else { // 行が見つからなかったら新しくデータを挿入
    sheet.appendRow(data);
    }
    }
    
   
    // 日付比較を行い、データがあれば行番号を返す関数
    function findRow2(sheet, date) {
    var searchDate = Utilities.formatDate(new Date(date), 'Asia/Tokyo','yyyy/MM/dd');
    var values = sheet.getDataRange().getValues();
    Logger.log(values + "findRow");
    for (var i = values.length - 1; i > 0; i--) {
    var dataDate = Utilities.formatDate(new Date(values[i][0]), 'Asia/Tokyo','yyyy/MM/dd');
    if (dataDate == searchDate) {
    return i + 1;
    }
    }
    return false;
    } 