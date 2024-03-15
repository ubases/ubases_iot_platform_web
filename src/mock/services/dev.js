import Mock from "mockjs2";
import { builder, getBody } from "../util";
let ojb4 = () => {
  return builder(
    {
      list: [
        {
          id: "7",
          name: "具参保人",
          productId: "4",
          productName: "将广无八低级",
          productTypeId: "46",
          productTypeName: "精面据位边",
          productTypeFullName: "民八水那界日",
          panelUrl: "http://jhrj.aw/xtvme",
          panelPreviewUrl: "http://ifa.中国互联.公司/oujymkmtm",
          desc: "eu",
        },
        {
          id: "13",
          name: "市决问然包就由",
          productId: "21",
          productName: "规学太强打性",
          productTypeId: "12",
          productTypeName: "提引飞提它",
          productTypeFullName: "府后报南会共造",
          panelUrl: "http://crctmpef.sl/xvnfctbc",
          panelPreviewUrl: "http://liqwdtuo.re/rmupgxye",
          desc: "in",
        },
      ],
      page: 1,
      total: 2,
    },
    "ok",
    0
  );
};
let ojb5 = () => {
  return builder({}, "ok", 0);
};
// 控制面板
Mock.mock(/\/v1\/platform\/web\/pm\/controlPanel\/list/, "post", ojb4);
Mock.mock(/\/v1\/platform\/web\/pm\/controlPanel\/delete/, "delete", ojb5);

let ojb6 = () => {
  return builder(
    {
      list: [
        {
          requestDateTime: 1337037471180,
          id: 7,
          account: "consectetur in",
          status: 2,
          companyName: "毛等重区",
        },
      ],
      page: 1,
      total: 2,
    },
    "ok",
    0
  );
};
let ojb7 = () => {
  return builder(
    {
      id: 47,
      nature: "dolor",
      status: 2,
      companyName: "路基济",
      licenseNo: "Lorem officia sunt tempor dolor",
      license: "http://dummyimage.com/400x400",
      legalPerson: "dolore",
      applyPerson: "labore nulla amet deserunt",
      idcard: "30",
      idcardFrontImg: "http://dummyimage.com/400x400",
      idcardAfterImg: "http://dummyimage.com/400x400",
      phone: "18612897759",
      address: "四川省林芝地区雷州市",
      list: [
        {
          why: "Excepteur et proident consectetur",
          result: "ex in minim",
          opterTime: "1994-10-02 07:22:01",
          opter: "labore ipsum laborum veniam dolore",
        },
        {
          opterTime: "2018-11-08 08:30:05",
          why: "cupidatat amet",
          opter: "sed nulla",
          result: "veniam in sed ut",
        },
        {
          opter: "in id do commodo cupidatat",
          opterTime: "1972-02-04 19:05:13",
          why: "incididunt ex esse minim",
          result: "elit velit nisi dolore sed",
        },
      ],
    },
    "ok",
    0
  );
};
// 开发者认证
Mock.mock(/\/v1\/platform\/web\/system\/getCompanyAuthList/, "get", ojb6);
Mock.mock(/\/v1\/platform\/web\/system\/companyauthdetail/, "get", ojb7);
let ojb8 = () => {
  return builder(
    [
      {
        name: "简体中文",
        code: "zh",
      },
      {
        name: "英文",
        code: "en",
      },
      {
        name: "法语",
        code: "fr",
      },
      {
        name: "西班牙语",
        code: "es",
      },
      {
        name: "意大利语",
        code: "it",
      },
      {
        name: "德语",
        code: "de",
      },
    ],
    "ok",
    0
  );
};
// 语言
Mock.mock(/\/v1\/platform\/web\/lang\/langTypeList/, "get", ojb8);

let obj9 = () => {
  return builder(
    {
      list: [
        {
          id: 1,
          status: 1,
          roleName: "铁亲些整员千周",
          number: 81,
          companyName: "信种道变治体",
          account: "sunt cupidatat",
        },
        {
          id: 2,
          status: 2,
          number: 43,
          companyName: "严需养红地",
          roleName: "场消保车接连",
          account: "eiusmod dolore ut",
        },
      ],
      page: 1,
      total: 2,
    },
    "ok",
    0
  );
};
let obj10 = () => {
  return builder(
    [
      {
        companyName: "时他造面",
        companyId: "54",
      },
      {
        companyName: "专毛引事叫能市",
        companyId: "64",
      },
      {
        companyName: "而观八革心",
        companyId: "10",
      },
      {
        companyId: "45",
        companyName: "方干专给",
      },
    ],
    "ok",
    0
  );
};
let obj11 = () => {
  return builder("", "ok", 0);
};
let obj12 = () => {
  return builder(
    {
      id: "1",
      account: "incididunt proident consectetur in in",
      companyName: "已传科断影完",
      roleName: "验局采本或",
      status: 1,
      phone: "18658604854",
      email: "v.mnsn@qq.com",
      address: "台湾苏州市和田县",
      contract: [
        {
          number: "42",
          contractDate: "1996-09-21",
        },
        {
          number: "4",
          contractDate: "2008-12-21",
        },
      ],
    },
    "ok",
    0
  );
};
// 开发者账号
Mock.mock(/\/v1\/platform\/web\/system\/deve\/list/, "get", obj9);
Mock.mock(/\/v1\/platform\/web\/system\/deve\/companylist/, "get", obj10);
Mock.mock(/\/v1\/platform\/web\/system\/deve/, "delete", obj11);
Mock.mock(/\/v1\/platform\/web\/system\/deve/, "get", obj12);

let obj13 = () => {
  return builder(
    [
      {
        fieldName: "tplContent",
        fieldValue: "tplContent",
        lang: "en",
      },
    ],
    "ok",
    0
  );
};
// 通知模板
// Mock.mock(/\/v1\/platform\/web\/lang\/translation\/get/, "get", obj13);

let obj14 = () => {
  return builder(
    {
      list: [
        {
          sort: 1,
          id: "42",
          menuKey: 2,
          required: 1,
          defImage: "http://dummyimage.com/400x400",
          name: "己议位不题九育",
          selImage: "http://dummyimage.com/400x400",
        },
        {
          id: "8",
          name: "广算太海气温",
          sort: 2,
          menuKey: 1,
          required: 2,
          selImage: "http://dummyimage.com/400x400",
          defImage: "http://dummyimage.com/400x400",
        },
      ],
      total: 2,
      page: 1,
    },
    "ok",
    0
  );
};
// 底部菜单栏相关
Mock.mock(/\/v1\/platform\/web\/system\/oemapp\/menu/, "get", obj14);

let obj15 = (res) => {
  return builder(11111, "ok", 0);
};

Mock.mock(/\/v1\/platform\/web\/system\/oemapp\/menu/, "post", obj15);
Mock.mock(/\/v1\/platform\/web\/system\/oemapp\/menu/, "put", obj15);

let obj16 = () => {
  return builder(
    {
      developer: {
        total: 42,
        data: [
          {
            time: "2020-02-10 14:49:51",
            total: 52,
          },
          {
            time: "1998-12-23 20:05:38",
            total: 75,
          },
          {
            time: "2007-08-09 23:38:53",
            total: 14,
          },
        ],
      },
      deviceFault: {
        total: 40,
        data: [
          {
            time: "1974-07-24 08:05:21",
            total: 76,
          },
        ],
      },
      appUser: {
        total: 26,
        data: [
          {
            time: "2010-11-28 11:18:34",
            total: 50,
          },
        ],
      },
      regionName: "众实参己此非",
      activeDevice: {
        total: 77,
        data: [
          {
            time: "1977-10-08 02:07:54",
            total: 82,
          },
          {
            time: "2002-09-17 20:39:00",
            total: 76,
          },
          {
            time: "2022-01-31 03:49:37",
            total: 31,
          },
        ],
      },
    },
    "ok",
    0
  );
};
let obj17 = () => {
  return builder(
    {
      deviceFault: {
        total: 67,
        data: [
          {
            time: "2010-08-13 14:42:32",
            total: 58,
          },
          {
            time: "2006-08-07 05:35:46",
            total: 72,
          },
          {
            time: "2017-08-10 14:50:35",
            total: 13,
          },
        ],
      },
      regionName: "八专电前样手",
      appUser: {
        total: 49,
        data: [
          {
            time: "2014-04-26 14:27:59",
            total: 11,
          },
          {
            time: "2019-07-06 03:42:46",
            total: 21,
          },
          {
            time: "2004-07-12 04:55:04",
            total: 45,
          },
          {
            time: "1970-02-18 01:02:27",
            total: 78,
          },
          {
            time: "2007-06-14 19:15:06",
            total: 9,
          },
        ],
      },
      developer: {
        total: 41,
        data: [
          {
            time: "2010-08-13 17:03:34",
            total: 63,
          },
        ],
      },
      activeDevice: {
        total: 74,
        data: [
          {
            time: "1976-08-01 01:28:03",
            total: 37,
          },
          {
            time: "2006-04-02 21:32:25",
            total: 20,
          },
          {
            time: "1998-06-18 22:56:39",
            total: 40,
          },
          {
            time: "2016-04-05 19:58:28",
            total: 39,
          },
        ],
      },
    },
    "ok",
    0
  );
};
let obj18 = () => {
  return builder(
    {
      country: "123",
      data: [
        {
          cityCode: "59",
          cityName: "长沙市",
          activeDevice: 53,
          onlineDevice: 84,
          longitude: 112.9836,
          latitude: 28.112743,
        },
        {
          cityCode: "60",
          cityName: "上海市",
          activeDevice: 53,
          onlineDevice: 0,
          longitude: 121.473662,
          latitude: 31.230372,
        },
        {
          cityCode: "61",
          cityName: "武汉市",
          activeDevice: 53,
          onlineDevice: 84,
          longitude: 114.341745,
          latitude: 30.546557,
        },
      ],
    },
    "ok",
    0
  );
};

// 数据中心
Mock.mock(/\/v1\/platform\/web\/data\/pm\/overview\/accumulate/, "get", obj16);
Mock.mock(/\/v1\/platform\/web\/data\/pm\/overview\/today/, "get", obj17);
Mock.mock(/\/v1\/platform\/web\/data\/pm\/overview\/city/, "get", obj18);

let obj19 = () => {
  return builder(
    {
      total: 5,
      page: 1,
      list: [
        {
          ip: "122.86.183.157",
          productName: "太利区社支",
          deviceKey: "amet ad esse consectetur veniam",
          faultName: "己选称道",
          faultCode: "51",
          deviceId: "10",
          deviceName: "小报美始亲",
          time: "1653995490",
        },
        {
          time: "1653995490",
          faultCode: "54",
          ip: "78.82.120.16",
          deviceKey: "id consectetur quis commodo aute",
          deviceId: "15",
          deviceName: "天积带切需号收",
          faultName: "发重除变",
          productName: "多公类且自压",
        },
        {
          faultName: "把把了毛容",
          deviceId: "66",
          ip: "7.102.92.206",
          deviceKey: "laboris aute nostrud",
          faultCode: "22",
          productName: "全正热列",
          time: "1653995490",
          deviceName: "放题机参严点",
        },
        {
          deviceName: "又政种",
          productName: "志气者那四此华",
          deviceKey: "occaecat fugiat qui",
          deviceId: "89",
          faultName: "要声常样",
          time: "1653995490",
          faultCode: "94",
          ip: "136.219.7.47",
        },
        {
          time: "1653995490",
          productName: "合导代义便解",
          faultCode: "95",
          deviceId: "58",
          faultName: "保价县及须",
          deviceKey: "exercitation officia",
          deviceName: "做最统叫",
          ip: "96.204.95.88",
        },
      ],
    },
    "ok",
    0
  );
};
Mock.mock(/\/v1\/platform\/web\/data\/pm\/deviceFault\/List/, "post", obj19);

let obj20 = () => {
  return builder(
    {
      total: 5,
      page: 1,
      list: [
        {
          acitveUserTotal: 98,
          appName: "龙非据正什",
          developerId: "58",
          registerUserTotal: 31,
          version: 3,
          appId: "61",
          feedbackQuantity: 77,
          verTotal: 88,
        },
        {
          developerId: "46",
          registerUserTotal: 39,
          appName: "边复称性叫做取",
          version: 87,
          acitveUserTotal: 12,
          feedbackQuantity: 27,
          appId: "47",
          verTotal: 40,
        },
        {
          appName: "打争群划",
          appId: "84",
          version: 5,
          verTotal: 88,
          registerUserTotal: 12,
          developerId: "66",
          acitveUserTotal: 16,
          feedbackQuantity: 62,
        },
        {
          feedbackQuantity: 27,
          appName: "样才政维表争",
          verTotal: 76,
          registerUserTotal: 32,
          appId: "37",
          version: 54,
          developerId: "93",
          acitveUserTotal: 18,
        },
        {
          acitveUserTotal: 82,
          version: 81,
          appId: "43",
          verTotal: 73,
          feedbackQuantity: 96,
          developerId: "42",
          registerUserTotal: 52,
          appName: "压革高该",
        },
      ],
    },
    "ok",
    0
  );
};
Mock.mock(/\/v1\/platform\/web\/data\/pm\/app\/list/, "post", obj20);

let obj21 = () => {
  return builder(
    {
      account: "Duis ipsum enim et do",
      appName: "对局起做因江",
      appType: "quis ea",
      acitveUserTotal: 4,
      versionList: [
        {
          appName: "与应八七天族",
          devStatus: 1,
          buildNumber: 23,
          lastOptTime: 1653995490,
          lastOptUser: "voluptate ullamco dolore cupidatat",
        },
      ],
      registerUserTotal: "elit enim",
    },
    "ok",
    0
  );
};
Mock.mock(/\/v1\/platform\/web\/data\/pm\/app\/detail/, "get", obj21);

let obj22 = () => {
  return builder(
    {
      total: 3,
      page: 1,
      list: [
        {
          online: 1,
          userId: "93",
          appTotal: 56,
          registerTime: 1653995490,
          loginAddr: "est minim cupidatat",
          quantity: 88,
          userName: "尹平",
          activeDeviceTotal: 16,
        },
        {
          userName: "廖霞",
          online: 2,
          quantity: 49,
          loginAddr: "nisi laboris reprehenderit velit amet",
          userId: "3",
          activeDeviceTotal: 73,
          appTotal: 66,
          registerTime: 1653995490,
        },
        {
          online: 1,
          loginAddr: "nisi do",
          appTotal: 91,
          userId: "72",
          quantity: 97,
          registerTime: 1653995490,
          userName: "邓芳",
          activeDeviceTotal: 99,
        },
      ],
    },
    "ok",
    0
  );
};
let obj23 = () => {
  return builder(
    {
      account: "Lorem ipsum quis",
      companyName: "后可精",
      roleName: "委内第",
      activeDeviceTotal: 42,
      appList: [
        {
          appId: "4",
          appName: "育前史己",
          devStatus: 1,
          version: "elit veniam",
          verTotal: "cillum Ut occaecat magna",
          onShelf: 41,
        },
        {
          appId: "50",
          appName: "专得该而干究",
          devStatus: 2,
          version: "nisi velit ullamco in fugiat",
          verTotal: "adipisicing cupidatat occaecat",
          onShelf: 37,
        },
      ],
    },
    "ok",
    0
  );
};
Mock.mock(/\/v1\/platform\/web\/data\/pm\/developer\/list/, "post", obj22);
Mock.mock(/\/v1\/platform\/web\/data\/pm\/developer\/detail/, "get", obj23);

let obj24 = () => {
  return builder(
    {
      list: [
        {
          lang: "cupidatat dolore fugiat officia",
          tplName: "和酸应于料三",
          id: "42",
          tplCode: "80",
          method: 75,
          thirdparyCode: "18",
          smsSupplier: 98,
          tplSubject: "exercitation sint nisi",
          tplContent: "incididunt cillum",
          tplType: 55,
          tplParams: "Ut dolor enim",
          pushType: 1,
          messageType: 1,
        },
      ],
      total: 1,
      page: 1,
    },
    "ok",
    0
  );
};
Mock.mock(/\/v1\/platform\/web\/template\/messageTpl\/list/, "post", obj24);

let obj25 = () => {
  return builder(
    {
      packageName: "OEM app公版语言包",
      langsDesc: "简体中文，英语，日语，西班牙语",
      uploadAt: "1654070217",
      uploadUser: "张三",
      id: "74",
      belongType: "3",
    },
    "ok",
    0
  );
};
Mock.mock(/\/v1\/platform\/web\/lang\/appResources\/detail/, "get", obj25);

let obj26 = () => {
  return builder(
    {
      list: [
        {
          id: "84",
          code: "74",
          value: "1",
          desc: "Duis",
          isCustom: "1",
        },
        {
          id: "58",
          code: "86",
          value: "1",
          desc: "ad eu tempor",
          isCustom: "1",
        },
        {
          id: "89",
          code: "7",
          value: "1",
          desc: "proident dolor exercitation",
          isCustom: "1",
        },
      ],
    },
    "ok",
    0
  );
};
Mock.mock(/\/v1\/platform\/web\/config\/systemConfig\/list/, "post", obj26);
Mock.mock(/\/v1\/platform\/web\/config\/systemConfig\/detail/, "get", obj25);
Mock.mock(/\/v1\/platform\/web\/config\/systemConfig\/add/, "post", obj25);
Mock.mock(/\/v1\/platform\/web\/config\/systemConfig\/edit/, "put", obj25);
Mock.mock(/\/v1\/platform\/web\/config\/systemConfig\/delete/, "delete", obj25);

let obj27 = () => {
  return builder(
    {
      total: 3,
      list: [
        {
          id: "1",
          account: "consectetur veniam in",
          appName: "和角府",
          region: 54,
          lastLoginTime: "1234567890",
        },
        {
          id: "2",
          account: "consectetur veniam in",
          appName: "和角府",
          region: 54,
          lastLoginTime: "1234567890",
        },
        {
          id: "3",
          account: "consectetur veniam in",
          appName: "和角府",
          region: 54,
          lastLoginTime: "1234567890",
        },
      ],
    },
    "ok",
    0
  );
};
let obj28 = () => {
  return builder(
    {
      total: 3,
      list: [
        {
          id: "1",
          eventName: "consectetur veniam in",
          logType: "和角府",
          details: {
            ip: 123123,
            system: 123123,
          },
          createdAt: "1234567890",
        },
        {
          id: "2",
          eventName: "consectetur veniam in",
          logType: "和角府",
          details: {
            ip: 123123,
            system: 123123,
          },
          createdAt: "1234567890",
        },
        {
          id: "3",
          eventName: "consectetur veniam in",
          logType: "和角府",
          details: {
            ip: 123123,
            system: 123123,
          },
          createdAt: "1234567890",
        },
      ],
    },
    "ok",
    0
  );
};
Mock.mock(/\/v1\/platform\/app\/user\/logList/, "post", obj27);
Mock.mock(/\/v1\/platform\/app\/user\/logRecords/, "post", obj28);

let obj29 = () => {
  return builder(
    {
      total: 3,
      list: [
        {
          langKey: "zh",
          sourceTable: "consectetur",
          sourceRowId: "yuyan123",
          fieldName: "123",
          name: "中文",
          nameEn: "英文",
        },
      ],
    },
    "ok",
    0
  );
};
Mock.mock(/\/v1\/platform\/web\/lang\/translation\/list/, "post", obj29);

let obj30 = () => {
  return builder("", "ok", 0);
};

let obj31 = () => {
  return builder(
    [
      {
        id: "1",
        parentId: "",
        docDirName: "测试名称一级",
        dirImg: "http://dummyimage.com/400x400",
      },
      {
        id: "2",
        parentId: "1",
        docDirName: "测试名称二级",
        dirImg: "http://dummyimage.com/400x400",
      },
      {
        id: "3",
        parentId: "1",
        docDirName: "测试名称二级",
        dirImg: "http://dummyimage.com/400x400",
      },
      {
        id: "4",
        parentId: "1",
        docDirName: "测试名称二级",
        dirImg: "http://dummyimage.com/400x400",
      },
      {
        id: "5",
        parentId: "",
        docDirName: "测试名称一级",
        dirImg: "http://dummyimage.com/400x400",
      },
      {
        id: "6",
        parentId: "5",
        docDirName: "测试名称二级1",
        dirImg: "http://dummyimage.com/400x400",
      },
    ],
    "ok",
    0
  );
};
let obj32 = () => {
  return builder(
    {
      id: "56",
      parentId: "83",
      dirImg: "http://dummyimage.com/400x400",
      docDirLangs: [
        {
          dirName: "积满听原更整",
          langName: "中文",
          lang: "zh",
        },
      ],
    },
    "ok",
    0
  );
};
Mock.mock(
  /\/v1\/platform\/web\/system\/app\/doc\/directory\/detail/,
  "get",
  obj32
);
Mock.mock(/\/v1\/platform\/web\/system\/app\/doc\/directory/, "get", obj31);
Mock.mock(/\/v1\/platform\/web\/system\/app\/doc\/directory/, "delete", obj30);
Mock.mock(/\/v1\/platform\/web\/system\/app\/doc\/directory/, "put", obj30);
Mock.mock(/\/v1\/platform\/web\/system\/app\/doc\/directory/, "post", obj30);
let obj33 = () => {
  return builder(
    {
      total: 1,
      list: [
        {
          id: 1,
          isEnable: 1,
          isNormal: 2,
          dirName: "党报里却",
          updateTime: 1234567890,
          sort: 1,
          title: "温置接五",
        },
      ],
    },
    "ok",
    0
  );
};
Mock.mock(/\/v1\/platform\/web\/system\/app\/doc\/entry\/list/, "get", obj33);
Mock.mock(/\/v1\/platform\/web\/system\/app\/doc\/entry/, "delete", obj30);

let obj34 = () => {
  return builder(
    {
      parentIds: ["1", "2"],
      setingId: "27",
      sort: 2,
      isEnable: 1,
      isNormal: 2,
    },
    "ok",
    0
  );
};
Mock.mock(/\/v1\/platform\/web\/system\/app\/doc\/entry\/seting/, "get", obj34);

Mock.mock(/\/v1\/platform\/web\/system\/app\/doc\/entry\/seting/, "put", obj34);

let obj35 = () => {
  return builder(
    {
      lang: "zh",
      title: "nisi tempor esse quis",
      content: "<p>nisi tempor esse quis</p>",
      id: "1",
      setingId: "1",
    },
    "ok",
    0
  );
};
Mock.mock(/\/v1\/platform\/web\/sytem\/app\/doc\/entry\/detail/, "get", obj35);
