function Hanlinks() {
}
// inclusive 指定處理網頁，其他不處理
// exclusion 排除處理網頁，其他處理
// 這兩個變數只能設置一個，若兩個皆設置，只有inclusive有效。
// 設置內容為document.location.pathname，如
//   "/showeudc.html","/dir1/dir2/*"
// 可尾綴*表示多重檔案
Hanlinks.inclusive = [];
Hanlinks.exclusion = [];
// 輸入法種類，不需要的就設為空值；第一個元素不得為空值，
// 其他依次為注音、倉頡、筆畫'ph.png', 'cj.png','sk.png'
Hanlinks.imeIcon = ['eudc.png', 'ph.png', 'cj.png', ''];

// 顯示螢幕小鍵盤, Android會自動開啟，若設為否，則Hanlinks.keyboardSize設定無效。
Hanlinks.withKeyboard = false;

// 螢幕小鍵盤大小：1~3，1:24px/cell, 2:36px/cell, 3:48px/cell
// 若為1，Android自動設為2
Hanlinks.keyboardSize = 1;

// 不處理輸入欄位，若為真，則Hanlinks.withoutInput設定無效
Hanlinks.ignoreField = false;

// 不要輸入法
Hanlinks.withoutInput = false;

// Content-Length 最大長度, 0表示無限制
Hanlinks.maxContentLength = 0;

// 難字輸入功能的控制按鍵，Ctrl +此鍵
Hanlinks.ctrlAndKey = 'Y';

// 用圖形顯示難字
Hanlinks.showImage = false;

// 除錯模式
Hanlinks.debugMode = true;

// 總是顯示難字框，IOS/Android會自動開啟
Hanlinks.allwaysShowEUDC = true;

// 下載整個造字檔
Hanlinks.downloadAllFonts = true;

// 圖檔名用requestString code=xxxx替代，用圖形顯示難字才有影響
Hanlinks.imageRequesString = false;

// 輸入欄位若alt屬性有此字則選擇性套用難字處理
Hanlinks.alt = 'webfont';

// 輸入欄位若有alt屬性則排除或加入套用難字處理，true為排除，false為加入
Hanlinks.altExclusion = false;

// 輸入欄位若有alt屬性，URI第一個路徑中有以下字串則與上述條件相反。
Hanlinks.altContexts = [];

// 輸入Unicode的字元時，警示的文字說明
Hanlinks.Notice = '\u8acb\u4ee5\u96e3\u5b57\u6a21\u5f0f(\u6309ctrl+Y)\u8f38\u5165\u3002\n\u6216\u516c\u53f8\u4e26\u7121\u8a72\u5b57\uff0c\u8acb\u5411\u670d\u52d9\u4e2d\u5fc3\u7533\u8acb\u9020\u5b57\uff0c\u9020\u5b57\u5b8c\u6210\u5f8c\u5373\u53ef\u4f7f\u7528\u3002';

// 造字擴充
Hanlinks.expension = true;

// UTF8網頁只能輸入Big5範圍內的字
Hanlinks.onlyBig5 = true;
