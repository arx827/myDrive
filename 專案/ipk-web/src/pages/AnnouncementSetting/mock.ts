const fakeFileGenerator = (index: number) => ({ id: index, name: `filename${index}.txt`, type: 'txt' });
const announcementData = {
  getAllAnnouncement: [
    {
      id: 1,
      title: '停用狀態公告',
      content: '<p>停用狀態公告內容測試</p>',
      attachment: [fakeFileGenerator(1)],
      documentNum: '(111)富壽商精發字第1號',
      publishDate: '2022-09-15',
      expiryDate: '2022-12-22',
      type: 1,
      status: 'DA',
      createName: 'B2212',
      createDate: '2022-09-15',
      updateName: 'B2212',
      updateDate: '2022-09-15',
    },
    {
      id: 2,
      title: '已發佈公告',
      content: '<p>已發佈公告內容測試</p>',
      attachment: [fakeFileGenerator(2)],
      documentNum: '(111)富壽商精發字第2號',
      publishDate: '2022-09-10',
      expiryDate: '2022-12-22',
      type: 2,
      status: 'EA',
      createName: 'B2212',
      createDate: '2022-09-10',
      updateName: 'B2212',
      updateDate: '2022-09-10',
    },
    {
      id: 3,
      title: '未發佈公告',
      content: '<p>未發佈公告內容測試</p>',
      attachment: [
        fakeFileGenerator(3),
        fakeFileGenerator(31),
      ],
      documentNum: '(111)富壽商精發字第3號',
      publishDate: '2022-12-25',
      expiryDate: '2023-01-07',
      type: 3,
      status: 'EA',
      createName: 'B2212',
      createDate: '2022-12-25',
      updateName: 'B2212',
      updateDate: '2022-12-25',
    },
    {
      id: 4,
      title: '已到期公告',
      content: '<p>已到期公告內容測試</p>',
      attachment: [fakeFileGenerator(4)],
      documentNum: '(111)富壽商精發字第4號',
      publishDate: '2022-02-10',
      expiryDate: '2022-07-15',
      type: 1,
      status: 'EA',
      createName: 'B2212',
      createDate: '2022-02-10',
      updateName: 'B2212',
      updateDate: '2022-02-10',
    },
    {
      id: 5,
      title: '一般正常公告',
      content: '<p>一般正常公告內容測試</p>',
      attachment: [fakeFileGenerator(5)],
      documentNum: '(111)富壽商精發字第5號',
      publishDate: '2022-09-15',
      expiryDate: '2022-12-22',
      type: 2,
      status: 'EA',
      createName: 'B2212',
      createDate: '2022-09-15',
      updateName: 'B2212',
      updateDate: '2022-09-15',
    },
    {
      id: 6,
      title: '一般正常公告',
      content: '<p>一般正常公告內容測試</p>',
      attachment: [fakeFileGenerator(6)],
      documentNum: '(111)富壽商精發字第6號',
      publishDate: '2022-09-15',
      expiryDate: '2022-12-22',
      type: 3,
      status: 'EA',
      createName: 'B2212',
      createDate: '2022-09-15',
      updateName: 'B2212',
      updateDate: '2022-09-15',
    },
    {
      id: 7,
      title: '一般正常公告',
      content: '<p>一般正常公告內容測試</p>',
      attachment: [fakeFileGenerator(7)],
      documentNum: '(111)富壽商精發字第7號',
      publishDate: '2022-09-15',
      expiryDate: '2022-12-22',
      type: 1,
      status: 'EA',
      createName: 'B2212',
      createDate: '2022-09-15',
      updateName: 'B2212',
      updateDate: '2022-09-15',
    },
    {
      id: 8,
      title: '一般正常公告',
      content: '<p>一般正常公告內容測試</p>',
      attachment: [fakeFileGenerator(8)],
      documentNum: '(111)富壽商精發字第8號',
      publishDate: '2022-09-15',
      expiryDate: '2022-12-22',
      type: 2,
      status: 'EA',
      createName: 'B2212',
      createDate: '2022-09-15',
      updateName: 'B2212',
      updateDate: '2022-09-15',
    },
    {
      id: 9,
      title: '一般正常公告',
      content: '<p>一般正常公告內容測試</p>',
      attachment: [fakeFileGenerator(9)],
      documentNum: '(111)富壽商精發字第9號',
      publishDate: '2022-09-15',
      expiryDate: '2022-12-22',
      type: 3,
      status: 'EA',
      createName: 'B2212',
      createDate: '2022-09-15',
      updateName: 'B2212',
      updateDate: '2022-09-15',
    },
    {
      id: 10,
      title: '一般正常公告',
      content: '<p>一般正常公告內容測試</p>',
      attachment: [fakeFileGenerator(10)],
      documentNum: '(111)富壽商精發字第10號',
      publishDate: '2022-09-15',
      expiryDate: '2022-12-22',
      type: 1,
      status: 'EA',
      createName: 'B2212',
      createDate: '2022-09-15',
      updateName: 'B2212',
      updateDate: '2022-09-15',
    },
  ],
  getAnnouncementData: {
    id: 193,
    title: '檢視測試',
    content: `<div><span style="font-size: 24pt;"><strong>另一個測試用的標題</strong></span></div>
    <div>&nbsp;</div>
    <div style="padding-left: 40px;"><span style="font-size: 12pt;">因為<span style="color: rgb(224, 62, 45);">ant-design-vue</span>有對於<span style="color: rgb(224, 62, 45);">p</span>標籤進行當<span style="background-color: rgb(241, 196, 15);">中文字大小的調整</span>導致編輯器和實際使用時看上去不一樣，暫時用<span style="color: rgb(0, 0, 0); background-color: rgb(241, 196, 15);">替換為div</span>的方式短解，直到找到有辦法新增content_css至tiny自己的內部的方式(目前因為尚未研究打包方面的相關問題所以這部分無法做到)</span></div>
    <div style="padding-left: 40px;">&nbsp;</div>
    <div style="padding-left: 40px;"><span style="font-size: 12pt;">因為ant-design-vue有對於p標籤進行當中文字大小的調整導致編輯器和實際使用時看上去不一樣，暫時用替換為div的方式短解，直到找到有辦法新增content_css至tiny自己的內部的方式(目前因為尚未研究打包方面的相關問題所以這部分無法做到)</span></div>`,
    announcer: '歐陽東昊',
    attachment: [fakeFileGenerator(193)],
    documentNum: '(111)富壽商精發字第20號',
    publishDate: '2022-09-15',
    expiryDate: '2022-12-22',
    type: 1,
    releaseDepartment: '人壽/董事長/總經理/財務精算處/財務精算處副三/商品精算部/通路專案科',
    clickTotal: 486,
  },
};
export default announcementData;
