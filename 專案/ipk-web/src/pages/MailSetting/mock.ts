const mailData = {
  getMailTemplate: [
    {
      id: 1,
      templateName: '防疫消毒V1',
      subject: '<樓管處再次通知>內湖大樓防疫消毒時間調整為{ SYSTEM_DATE_CE }施作10樓，其他樓層維持{ SYSTEM_DATE_CE }施作，請知悉。謝謝!!',
      content: `<div>
      <p class="MsoNormal"><strong><span style="font-size: 14.0pt; font-family: 標楷體; color: #0070c0; mso-fareast-language: ZH-TW;">各位長官<span lang="EN-US">&nbsp;</span>同仁，大家好<span lang="EN-US">:</span></span></strong></p>
      <p class="MsoNormal"><strong><span lang="EN-US" style="font-size: 14.0pt; font-family: 標楷體; color: #0070c0; mso-fareast-language: ZH-TW;">&nbsp;</span></strong></p>
      <p class="MsoNormal"><strong><span lang="EN-US" style="font-size: 14.0pt; font-family: 標楷體; color: #0070c0; mso-fareast-language: ZH-TW;">&nbsp; &nbsp;&nbsp;</span></strong><strong><span style="font-size: 14.0pt; font-family: 標楷體; color: #0070c0; mso-fareast-language: ZH-TW;">因樓管處再次調整防疫消毒時間，結論如下<span lang="EN-US">: </span></span></strong></p>
      <p class="MsoNormal"><strong><span lang="EN-US" style="font-size: 14.0pt; font-family: 標楷體; color: #0070c0; mso-fareast-language: ZH-TW;">&nbsp;&nbsp;&nbsp;&nbsp;(1) 10</span></strong><strong><span style="font-size: 14.0pt; font-family: 標楷體; color: #0070c0; mso-fareast-language: ZH-TW;">樓同仁注意<span lang="EN-US">:&nbsp;</span></span></strong><strong><span lang="EN-US" style="font-size: 14.0pt; font-family: 標楷體; color: #1f497d; mso-fareast-language: ZH-TW;"> </span></strong><strong><span lang="EN-US" style="font-size: 14.0pt; font-family: 標楷體; color: red; mso-fareast-language: ZH-TW;">9/30(</span></strong><strong><span style="font-size: 14.0pt; font-family: 標楷體; color: red; mso-fareast-language: ZH-TW;">五<span lang="EN-US">) </span></span></strong><strong><span style="font-size: 14.0pt; font-family: 標楷體; color: #0070c0; mso-fareast-language: ZH-TW;">欲加班的同仁特別注意，請於</span></strong><strong><span lang="EN-US" style="font-size: 14.0pt; font-family: 標楷體; color: red; mso-fareast-language: ZH-TW;">PM 9:30</span></strong><strong><span style="font-size: 14.0pt; font-family: 標楷體; color: #0070c0; mso-fareast-language: ZH-TW;">前離開。</span></strong></p>
      <p class="MsoNormal"><strong><span lang="EN-US" style="font-size: 14.0pt; font-family: 標楷體; color: #0070c0; mso-fareast-language: ZH-TW;">&nbsp;&nbsp;&nbsp; (2) &nbsp;4</span></strong><strong><span style="font-size: 14.0pt; font-family: 標楷體; color: #0070c0; mso-fareast-language: ZH-TW;">樓同仁注意<span lang="EN-US">:&nbsp; </span></span></strong><strong><span lang="EN-US" style="font-size: 14.0pt; font-family: 標楷體; color: red; mso-fareast-language: ZH-TW;">10/2(</span></strong><strong><span style="font-size: 14.0pt; font-family: 標楷體; color: red; mso-fareast-language: ZH-TW;">日<span lang="EN-US">) PM 8:00 </span></span></strong><strong><span style="font-size: 14.0pt; font-family: 標楷體; color: #0070c0; mso-fareast-language: ZH-TW;">防疫消毒施作，請知悉。</span></strong></p>
      <p class="MsoNormal"><strong><span lang="EN-US" style="font-size: 14.0pt; font-family: 標楷體; color: #0070c0; mso-fareast-language: ZH-TW;">&nbsp;</span></strong></p>
      <p class="MsoNormal"><strong><span lang="EN-US" style="font-size: 14.0pt; font-family: 標楷體; color: #0070c0; mso-fareast-language: ZH-TW;">&nbsp; &nbsp;&nbsp;</span></strong><strong><span style="font-size: 14.0pt; font-family: 標楷體; color: #0070c0; mso-fareast-language: ZH-TW;">以上說明。謝謝<span lang="EN-US">!!</span></span></strong></p>
      </div>`,
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
      templateName: '金控謝年會',
      subject: '金控謝年會',
      content: `<div>
      <p class="MsoNormal"><span lang="EN-US">Dears</span><span style="font-family: '新細明體',serif;">，</span></p>
      <p class="MsoNormal"><span lang="EN-US">&nbsp;</span></p>
      <p class="MsoNormal"><span style="font-family: '新細明體',serif;">剛才從總經理工作會報中得知</span><span lang="EN-US">&hellip;</span></p>
      <p class="MsoNormal"><span style="font-family: '新細明體',serif;">因疫情停辦</span><span lang="EN-US">2</span><span style="font-family: '新細明體',serif;">年的金控謝年會，今年會恢復舉辦，台北場時間為：</span><span lang="EN-US">1/14(</span><span style="font-family: '新細明體',serif;">六</span><span lang="EN-US">)</span><span style="font-family: '新細明體',serif;">，地點應該也是在南港展覽館！</span></p>
      <p class="MsoNormal"><span lang="EN-US">&nbsp;</span></p>
      <p class="MsoNormal"><span style="font-family: '新細明體',serif;">以上訊息，先行知會各位</span></p>
      <p class="MsoNormal"><span lang="EN-US">&nbsp;</span></p>
      <p class="MsoNormal"><span style="font-family: '新細明體',serif;">謝謝</span></p>
      </div>`,
      contentSymbol: [],
      trigger: '覆核成功',
      createName: 'B2212',
      createDate: '2022-09-15',
      updateName: 'B2212',
      updateDate: '2022-09-15',
    },
    {
      id: 3,
      templateName: '防疫關懷',
      subject: '防疫關懷',
      content: `<div>
      <p class="MsoNormal" style="mso-line-height-alt: 0pt;"><span style="font-family: '微軟正黑體',sans-serif;">各位主管與同仁們 好</span></p>
      <p class="MsoNormal" style="margin-top: 6.0pt; mso-para-margin-top: .5gd; mso-line-height-alt: 0pt;"><span style="font-family: '微軟正黑體',sans-serif;">提醒您<span lang="EN-US">, </span>新冠疫情目前仍在流行，確診者雖大多是輕症，但病毒傳染力很強，為降低疫情傳播機會，請落實公司防疫措施，並留意個人及家人之健康狀況</span></p>
      <p class="MsoListParagraph" style="margin-left: 17.85pt; mso-para-margin-left: 0gd; text-indent: -17.85pt; mso-line-height-alt: 0pt; mso-list: l0 level1 lfo1;"><!-- [if !supportLists]--><span lang="EN-US" style="font-family: '微軟正黑體',sans-serif; mso-bidi-font-family: 微軟正黑體;"><span style="mso-list: Ignore;">1.<span style="font: 7.0pt 'Times New Roman';">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><!--[endif]--><span style="font-family: '微軟正黑體',sans-serif; background: yellow; mso-highlight: yellow;">同仁或同住親友<u>出現疑似症狀等<span lang="EN-US">(</span>如發燒、咳嗽、喉嚨痛、腹瀉、嗅味覺異常&hellip;等<span lang="EN-US">)</span>，即使快篩陰仍請第一時間向您的主管通報</u>，由主管依狀況評估並採取相應的措施</span><span style="font-family: '微軟正黑體',sans-serif;">。</span></p>
      <p class="MsoListParagraph" style="margin-left: 18.0pt; mso-para-margin-left: 0gd; text-indent: -18.0pt; mso-line-height-alt: 0pt; mso-list: l0 level1 lfo1;"><!-- [if !supportLists]--><span lang="EN-US" style="font-family: '微軟正黑體',sans-serif; mso-bidi-font-family: 微軟正黑體;"><span style="mso-list: Ignore;">2.<span style="font: 7.0pt 'Times New Roman';">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><!--[endif]--><u><span style="font-family: '微軟正黑體',sans-serif;">同仁或同住親友快篩陽性，請第一時間向您的主管通報</span></u><span style="font-family: '微軟正黑體',sans-serif;">。同仁快篩陽性並經醫師診斷確診者，請依政府規定治療並完成居家隔離，在無法工作的情況下，可以請假。</span></p>
      <p class="MsoListParagraph" style="margin-left: 18.0pt; mso-para-margin-left: 0gd; mso-line-height-alt: 0pt;"><strong><u><span style="font-family: '微軟正黑體',sans-serif;">確診同仁 </span></u></strong><u><span style="font-family: '微軟正黑體',sans-serif;">居家隔離<span lang="EN-US">(3+4</span>天<span lang="EN-US">)</span>後，快篩陰性始得進公司；快篩陽性者再延長<span lang="EN-US">5</span>天居家辦公，結束後須再次快篩陰性方可進公司</span></u><span style="font-family: '微軟正黑體',sans-serif;">。</span></p>
      <p class="MsoListParagraph" style="margin-left: 0cm; mso-para-margin-left: 0gd; mso-line-height-alt: 0pt;"><span lang="EN-US" style="font-size: 11.0pt; color: #1f497d;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span><strong><u><span style="font-family: '微軟正黑體',sans-serif;">同住親友快篩陽性<span lang="EN-US">/</span>確診</span></u></strong><u><span lang="EN-US" style="font-family: '微軟正黑體',sans-serif;">, </span></u><u><span style="font-family: '微軟正黑體',sans-serif;">同仁居家<span lang="EN-US">5</span>天後，快篩陰性始得進公司</span></u><span style="font-family: '微軟正黑體',sans-serif;">。</span></p>
      <p class="MsoListParagraph" style="margin-left: 18.0pt; mso-para-margin-left: 0gd; text-indent: -18.0pt; mso-line-height-alt: 0pt; mso-list: l0 level1 lfo1;"><!-- [if !supportLists]--><span lang="EN-US" style="font-family: '微軟正黑體',sans-serif; mso-bidi-font-family: 微軟正黑體;"><span style="mso-list: Ignore;">3.<span style="font: 7.0pt 'Times New Roman';">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><!--[endif]--><span style="font-family: '微軟正黑體',sans-serif;">同仁除飲食外於辦公場所及外出時，一律全程佩戴口罩，維持社交距離。</span></p>
      <p class="MsoListParagraph" style="margin-left: 18.0pt; mso-para-margin-left: 0gd; text-indent: -18.0pt; mso-line-height-alt: 0pt; mso-list: l0 level1 lfo1;"><!-- [if !supportLists]--><span lang="EN-US" style="font-family: '微軟正黑體',sans-serif; mso-bidi-font-family: 微軟正黑體;"><span style="mso-list: Ignore;">4.<span style="font: 7.0pt 'Times New Roman';">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><!--[endif]--><span style="font-family: '微軟正黑體',sans-serif;">同仁於<u>確診及解除隔離後再度發生確診</u>，雖衛生主管機關可能認定為同一次確診或未再次開立居隔書，但為維護職場安全，同仁<u>仍以不進入辦公場所<span lang="EN-US">7</span>天為原則，嗣後確定快篩陰性後再返回</u>。</span></p>
      <p class="MsoNormal" style="margin-top: 6.0pt; mso-para-margin-top: .5gd;"><span lang="EN-US" style="font-family: '微軟正黑體',sans-serif;">~ </span><span style="font-family: '微軟正黑體',sans-serif;">全面防疫<span lang="EN-US">&nbsp; </span>好好保護自己<span lang="EN-US">&nbsp; </span>也能保護他人健康<span lang="EN-US"> ~</span></span></p>
      <p class="MsoNormal"><span lang="EN-US" style="font-size: 11.0pt;">&nbsp;</span></p>
      <p class="MsoNormal"><span style="font-size: 11.0pt; font-family: '微軟正黑體',sans-serif;">謝謝<span style="color: #1f497d;"> </span></span></p>
      <p class="MsoNormal"><span lang="EN-US" style="font-size: 11.0pt;">&nbsp;</span></p>
      <p class="MsoNormal"><span lang="EN-US" style="font-size: 11.0pt; font-family: 'Trebuchet MS',sans-serif; color: #0070c0;">Sincerely yours,</span></p>
      </div>`,
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
    templateName: '防疫消毒V1',
    subject: '<樓管處再次通知>內湖大樓防疫消毒時間調整為{ SYSTEM_DATE_CE }施作10樓，其他樓層維持{ SYSTEM_DATE_CE }施作，請知悉。謝謝!!',
    content: `<div>
    <p class="MsoNormal"><strong><span style="font-size: 14.0pt; font-family: 標楷體; color: #0070c0; mso-fareast-language: ZH-TW;">各位長官<span lang="EN-US">&nbsp;</span>同仁，大家好<span lang="EN-US">:</span></span></strong></p>
    <p class="MsoNormal"><strong><span lang="EN-US" style="font-size: 14.0pt; font-family: 標楷體; color: #0070c0; mso-fareast-language: ZH-TW;">&nbsp;</span></strong></p>
    <p class="MsoNormal"><strong><span lang="EN-US" style="font-size: 14.0pt; font-family: 標楷體; color: #0070c0; mso-fareast-language: ZH-TW;">&nbsp; &nbsp;&nbsp;</span></strong><strong><span style="font-size: 14.0pt; font-family: 標楷體; color: #0070c0; mso-fareast-language: ZH-TW;">因樓管處再次調整防疫消毒時間，結論如下<span lang="EN-US">: </span></span></strong></p>
    <p class="MsoNormal"><strong><span lang="EN-US" style="font-size: 14.0pt; font-family: 標楷體; color: #0070c0; mso-fareast-language: ZH-TW;">&nbsp;&nbsp;&nbsp;&nbsp;(1) 10</span></strong><strong><span style="font-size: 14.0pt; font-family: 標楷體; color: #0070c0; mso-fareast-language: ZH-TW;">樓同仁注意<span lang="EN-US">:&nbsp;</span></span></strong><strong><span lang="EN-US" style="font-size: 14.0pt; font-family: 標楷體; color: #1f497d; mso-fareast-language: ZH-TW;"> </span></strong><strong><span lang="EN-US" style="font-size: 14.0pt; font-family: 標楷體; color: red; mso-fareast-language: ZH-TW;">9/30(</span></strong><strong><span style="font-size: 14.0pt; font-family: 標楷體; color: red; mso-fareast-language: ZH-TW;">五<span lang="EN-US">) </span></span></strong><strong><span style="font-size: 14.0pt; font-family: 標楷體; color: #0070c0; mso-fareast-language: ZH-TW;">欲加班的同仁特別注意，請於</span></strong><strong><span lang="EN-US" style="font-size: 14.0pt; font-family: 標楷體; color: red; mso-fareast-language: ZH-TW;">PM 9:30</span></strong><strong><span style="font-size: 14.0pt; font-family: 標楷體; color: #0070c0; mso-fareast-language: ZH-TW;">前離開。</span></strong></p>
    <p class="MsoNormal"><strong><span lang="EN-US" style="font-size: 14.0pt; font-family: 標楷體; color: #0070c0; mso-fareast-language: ZH-TW;">&nbsp;&nbsp;&nbsp; (2) &nbsp;4</span></strong><strong><span style="font-size: 14.0pt; font-family: 標楷體; color: #0070c0; mso-fareast-language: ZH-TW;">樓同仁注意<span lang="EN-US">:&nbsp; </span></span></strong><strong><span lang="EN-US" style="font-size: 14.0pt; font-family: 標楷體; color: red; mso-fareast-language: ZH-TW;">10/2(</span></strong><strong><span style="font-size: 14.0pt; font-family: 標楷體; color: red; mso-fareast-language: ZH-TW;">日<span lang="EN-US">) PM 8:00 </span></span></strong><strong><span style="font-size: 14.0pt; font-family: 標楷體; color: #0070c0; mso-fareast-language: ZH-TW;">防疫消毒施作，請知悉。</span></strong></p>
    <p class="MsoNormal"><strong><span lang="EN-US" style="font-size: 14.0pt; font-family: 標楷體; color: #0070c0; mso-fareast-language: ZH-TW;">&nbsp;</span></strong></p>
    <p class="MsoNormal"><strong><span lang="EN-US" style="font-size: 14.0pt; font-family: 標楷體; color: #0070c0; mso-fareast-language: ZH-TW;">&nbsp; &nbsp;&nbsp;</span></strong><strong><span style="font-size: 14.0pt; font-family: 標楷體; color: #0070c0; mso-fareast-language: ZH-TW;">以上說明。謝謝<span lang="EN-US">!!</span></span></strong></p>
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
    { label: '防疫消毒V1', value: 1 },
    { label: '金控謝年會', value: 2 },
    { label: '防疫關懷', value: 3 },
  ],
};

export default mailData;
