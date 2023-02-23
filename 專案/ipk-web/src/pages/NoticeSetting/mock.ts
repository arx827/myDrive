const noticeData = {
  getAllNoticeTemplate: [
    {
      id: 1,
      templateName: '系統維護通知V1',
      title: '系統維護通知',
      content: `<div>投資部位系統為提升更好的服務品質，並因應 Windows 公告重大修補漏洞更新，本系統安排於 { SYSTEM_DATE_CE } 進行系統維護作業，屆時將暫停投資部位系統相關服務。</div>
      <div>&nbsp;</div>
      <div>造成不便、敬請見諒!</div>
      <div>&nbsp;</div>
      <div style="text-align: right;">BY 系統管理員</div>`,
      contentSymbol: [
        // {
        //   id: 5,
        //   name: '管理員員工編號',
        //   template: '{ ADMINISTRATOR_EMPID }',
        //   preview: 'A1234',
        // },
        // {
        //   id: 12,
        //   name: '事業單位名稱',
        //   template: '{ BUSINESS_UNIT_NAME }',
        //   preview: '富邦人壽保險股份有限公司/董事長/副董事長/總經理/經營企劃處/經營企劃處副一/秘書總務部/秘書科',
        // },
        // {
        //   id: 14,
        //   name: '事業群名稱',
        //   template: '{ BUSINESS_GROUP_NAME }',
        //   preview: '人壽/董事長/總經理/經營企劃處/經營企劃處副一/秘書總務部/秘書科',
        // },
        {
          id: 15,
          name: '系統日期(西元)',
          template: '{ SYSTEM_DATE_CE }',
          preview: '2022-09-29',
        },
        // {
        //   id: 16,
        //   name: '申請日期(西元)',
        //   template: '{ APPLY_DATE_CE }',
        //   preview: '2022-09-29',
        // },
      ],
      trigger: '',
      createName: 'B2212',
      createDate: '2022-09-15',
      updateName: 'B2212',
      updateDate: '2022-09-15',
    },
    {
      id: 2,
      templateName: '覆核成功版型V1',
      title: '覆核成功',
      content: '<div>覆核成功</div>',
      contentSymbol: [],
      trigger: '覆核成功',
      createName: 'B2212',
      createDate: '2022-09-15',
      updateName: 'B2212',
      updateDate: '2022-09-15',
    },
    {
      id: 3,
      templateName: '覆核失敗版型V1',
      title: '覆核失敗',
      content: '<div>覆核失敗</div>',
      contentSymbol: [],
      trigger: '覆核失敗',
      createName: 'B2212',
      createDate: '2022-09-15',
      updateName: 'B2212',
      updateDate: '2022-09-15',
    },
  ],
  getNoticeTemplateData: {
    id: 1,
    templateName: '系統維護通知V1',
    title: '系統維護通知',
    content: `<div class="ExternalClass97FC38DA7A6644F3BAD25CFC1F921F3F">
    <div id="flowcontent">
    <p class="MsoNormal" style="margin-left: 28.3pt; text-align: justify; text-justify: inter-ideograph; text-indent: -28.3pt; line-height: 150%;"><span style="font-family: 標楷體;"><span style="font-size: 14pt; line-height: 150%; color: black;">一、為落實對海外保險子公司董事會議事運作之監督與管理，促進議事作業之制度化，制定「富邦人壽保險股份有限公司對子公司董事會議事作業督導管理辦法」，業經董事長核定，其全文暨規章制（修）訂摘要表詳附件一。</span></span></p>
    <p class="MsoNormal" style="margin-left: 28.3pt; text-align: justify; text-justify: inter-ideograph; text-indent: -28.3pt; line-height: 150%;"><span style="font-family: 標楷體;"><span style="font-size: 14pt; line-height: 150%; color: black;">二、另為因應前揭督導管理辦法制定及實務作業需要，配合修訂「富邦人壽對子公司暨派有董監之轉投資公司董事會議事作業管理辦法」及「富邦人壽保險股份有限公司對指派或推薦轉投資公司之董事及監察人管理辦法」，業經董事長核定，其全文暨規章制（修）訂摘要表詳附件二及附件三。</span></span></p>
    <p class="MsoNormal" style="margin-left: 28.3pt; text-align: justify; text-justify: inter-ideograph; text-indent: -28.3pt; line-height: 150%;"><span style="font-size: 14pt; line-height: 150%; color: black;"><span style="font-family: 標楷體;">三、以上規範自即日起生效，請各業務相關單位注意配合辦理各項作業，相關說明詳附件「業務公告函」。</span></span></p>
    </div>
    </div>
    <div class="ExternalClass97FC38DA7A6644F3BAD25CFC1F921F3F">
    <div id="flowcontent">
    <p class="MsoNormal" style="margin-left: 28.3pt; text-align: justify; text-justify: inter-ideograph; text-indent: -28.3pt; line-height: 150%;"><span style="font-family: 標楷體;"><span style="font-size: 14pt; line-height: 150%; color: black;">一、為落實對海外保險子公司董事會議事運作之監督與管理，促進議事作業之制度化，制定「富邦人壽保險股份有限公司對子公司董事會議事作業督導管理辦法」，業經董事長核定，其全文暨規章制（修）訂摘要表詳附件一。</span></span></p>
    <p class="MsoNormal" style="margin-left: 28.3pt; text-align: justify; text-justify: inter-ideograph; text-indent: -28.3pt; line-height: 150%;"><span style="font-family: 標楷體;"><span style="font-size: 14pt; line-height: 150%; color: black;">二、另為因應前揭督導管理辦法制定及實務作業需要，配合修訂「富邦人壽對子公司暨派有董監之轉投資公司董事會議事作業管理辦法」及「富邦人壽保險股份有限公司對指派或推薦轉投資公司之董事及監察人管理辦法」，業經董事長核定，其全文暨規章制（修）訂摘要表詳附件二及附件三。</span></span></p>
    <p class="MsoNormal" style="margin-left: 28.3pt; text-align: justify; text-justify: inter-ideograph; text-indent: -28.3pt; line-height: 150%;"><span style="font-size: 14pt; line-height: 150%; color: black;"><span style="font-family: 標楷體;">三、以上規範自即日起生效，請各業務相關單位注意配合辦理各項作業，相關說明詳附件「業務公告函」。</span></span></p>
    </div>
    </div>
    <div class="ExternalClass97FC38DA7A6644F3BAD25CFC1F921F3F">
    <div id="flowcontent">
    <p class="MsoNormal" style="margin-left: 28.3pt; text-align: justify; text-justify: inter-ideograph; text-indent: -28.3pt; line-height: 150%;"><span style="font-family: 標楷體;"><span style="font-size: 14pt; line-height: 150%; color: black;">一、為落實對海外保險子公司董事會議事運作之監督與管理，促進議事作業之制度化，制定「富邦人壽保險股份有限公司對子公司董事會議事作業督導管理辦法」，業經董事長核定，其全文暨規章制（修）訂摘要表詳附件一。</span></span></p>
    <p class="MsoNormal" style="margin-left: 28.3pt; text-align: justify; text-justify: inter-ideograph; text-indent: -28.3pt; line-height: 150%;"><span style="font-family: 標楷體;"><span style="font-size: 14pt; line-height: 150%; color: black;">二、另為因應前揭督導管理辦法制定及實務作業需要，配合修訂「富邦人壽對子公司暨派有董監之轉投資公司董事會議事作業管理辦法」及「富邦人壽保險股份有限公司對指派或推薦轉投資公司之董事及監察人管理辦法」，業經董事長核定，其全文暨規章制（修）訂摘要表詳附件二及附件三。</span></span></p>
    <p class="MsoNormal" style="margin-left: 28.3pt; text-align: justify; text-justify: inter-ideograph; text-indent: -28.3pt; line-height: 150%;"><span style="font-size: 14pt; line-height: 150%; color: black;"><span style="font-family: 標楷體;">三、以上規範自即日起生效，請各業務相關單位注意配合辦理各項作業，相關說明詳附件「業務公告函」。</span></span></p>
    </div>
    </div>`,
    contentSymbol: [
      {
        id: 15,
        name: '系統日期(西元)',
        template: '{ SYSTEM_DATE_CE }',
        preview: '2022-09-29',
      },
    ],
    trigger: '',
    createName: 'B2212',
    createDate: '2022-09-15',
    updateName: 'B2212',
    updateDate: '2022-09-15',
  },
  getAvailableContentTemplate: {
    0: [
      {
        id: 1,
        name: '一般使用者員工編號',
        template: '{ NORMAL_USER_EMPID }',
        preview: 'N1234',
      },
      {
        id: 2,
        name: '一般使用者姓名',
        template: '{ NORMAL_USER_NAME }',
        preview: '張XX',
      },
      {
        id: 3,
        name: '主管員工編號',
        template: '{ SUPERVISOR_EMPID }',
        preview: 'S1234',
      },
      {
        id: 4,
        name: '主管姓名',
        template: '{ SUPERVISOR_NAME }',
        preview: '張XX',
      },
      {
        id: 5,
        name: '管理員員工編號',
        template: '{ ADMINISTRATOR_EMPID }',
        preview: 'A1234',
      },
      {
        id: 6,
        name: '管理員姓名',
        template: '{ ADMINISTRATOR_NAME }',
        preview: '張XX',
      },
      {
        id: 7,
        name: '申請人員工編號',
        template: '{ APPLICANT_EMPID }',
        preview: 'A1234',
      },
      {
        id: 8,
        name: '申請人姓名',
        template: '{ APPLICANT_NAME }',
        preview: '張XX',
      },
      {
        id: 9,
        name: '代理人員工編號',
        template: '{ AGENT_EMPID }',
        preview: 'A1234',
      },
      {
        id: 10,
        name: '代理人姓名',
        template: '{ AGENT_NAME }',
        preview: '張XX',
      },
      {
        id: 11,
        name: '事業單位代號',
        template: '{ BUSINESS_UNIT_CODE }',
        preview: 'VLC00',
      },
      {
        id: 12,
        name: '事業單位名稱',
        template: '{ BUSINESS_UNIT_NAME }',
        preview: '富邦人壽保險股份有限公司/董事長/副董事長/總經理/經營企劃處/經營企劃處副一/秘書總務部/秘書科',
      },
      {
        id: 13,
        name: '事業群代號',
        template: '{ BUSINESS_GROUP_CODE }',
        preview: 'VLC00',
      },
      {
        id: 14,
        name: '事業群名稱',
        template: '{ BUSINESS_GROUP_NAME }',
        preview: '人壽/董事長/總經理/經營企劃處/經營企劃處副一/秘書總務部/秘書科',
      },
      {
        id: 15,
        name: '系統日期(西元)',
        template: '{ SYSTEM_DATE_CE }',
        preview: '2022-09-29',
      },
      {
        id: 16,
        name: '申請日期(西元)',
        template: '{ APPLY_DATE_CE }',
        preview: '2022-09-29',
      },
    ],
  },
  getTemplateList: [
    { label: '系統維護通知V1', value: 1 },
    { label: '覆核成功版型V1', value: 2 },
    { label: '覆核失敗版型V1', value: 3 },
  ],
};
export default noticeData;
