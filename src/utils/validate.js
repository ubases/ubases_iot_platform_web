// 邮箱正则
export const EMAIL_REG =
  /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;

// 手机号正则
export const PHONE_REG = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;

// 中文正则
export const ZH_REG = /^[\u4e00-\u9fa5]{0,}$/;

// 英文正则
export const EN_REG = /^[A-Za-z]+$/;

// 英文数字正则
export const EN_NUMBER_REG = /^[A-Za-z0-9]+$/;

// 版本号正则
export const VERSION_REG = /^([0-9]\d|[0-9])(.([0-9]\d|\d)){2}$/; 

// 版本号含字母正则
export const VERSION_EN_REG =  /^([0-9]\d|[0-9])(.([0-9]\d|\d))(.([0-9]\d|\d)[A-Za-z0-9_]{0,})$/;

// wifi正则
export const EN_NUMBER___REG = /^[A-Za-z0-9_]+$/;

// 英文 数字 符号正则
export const NUMBER_EN_SYM_REG =
  /^[\a-\z\A-\Z0-9\.\,\?\<\>\。\，\-\——\=\;\@\！\!\+]+$/g;

// 中文 英文 数字正则
export const ZH_EN_NUMBER_REG = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;

// 中文 英文 数字 空格正则
export const ZH_EN_NUMBER_BLANK_REG = /^[A-Za-z0-9\s\u4e00-\u9fa5]+$/;

// 英文 数字 空格正则
export const EN_NUMBER_BLANK_REG = /^[A-Za-z0-9\s]+$/;

// 中文名称限制
export const ZhNameRules = (message, trigger = "") => {
  return [
    {
      required: true,
      message, // 请输入xxx
      trigger,
    },
    {
      required: true,
      min: 1,
      max: 50,
      message: "字符长度在1-50",
      trigger,
    },
    {
      required: true,
      pattern: ZH_EN_NUMBER_REG,
      message: "限制中文,英文和数字",
      trigger,
    },
  ];
};

// 英文名称限制
export const EnNameRules = (message, trigger = "") => {
  return [
    {
      required: true,
      message, // 请输入xxx
      trigger,
    },
    {
      required: true,
      min: 1,
      max: 50,
      message: "字符长度在1-50",
      trigger,
    },
    {
      required: true,
      pattern: /^[\a-\z\A-\Z0-9\ \.\,\?\<\>\。\，\-\——\=\;\@\！\!\+]+$/g,
      message: "限制英文,数字和部分常用符号",
      trigger,
    },
  ];
};

// 英文数字名称限制
export const EnNumberRules = (message, trigger = "") => {
  return [
    {
      required: true,
      message, // 请输入xxx
      trigger,
    },
    {
      required: true,
      min: 1,
      max: 50,
      message: "字符长度在1-50",
      trigger,
    },
    {
      required: true,
      pattern: EN_NUMBER_REG,
      message: "只能输入英文和数字不能使用空格,符号",
      trigger,
    },
  ];
};

// 普通校验
export const CommonRules = (message, type = "", trigger = "") => {
  return [
    {
      type,
      required: true,
      message, // 请输入xxx
      trigger,
    },
  ];
};

// 表单字段长度限制
export const CommonLengthRules = (
  min = 0,
  max = 50,
  message = "字符长度0-50",
  required = false
) => {
  return [
    {
      required,
      min,
      max,
      message,
    },
  ];
};

// 普通名称校验
export const CommonNameRules = (
  message,
  maxLength = 50,
  minLength = 1,
  trigger = ""
) => {
  return [
    {
      required: true,
      message, // 请输入xxx
      trigger,
    },
    {
      required: true,
      min: minLength,
      max: maxLength,
      message: `字符长度在${minLength}-${maxLength}`,
      trigger,
    },
  ];
};

// 手机号校验
export const PhoneRules = (message = "请输入手机号码", trigger = "") => {
  return [
    {
      required: true,
      message, // 请输入xxx
      trigger,
    },
    {
      required: true,
      pattern: PHONE_REG,
      message: "请输入正确的手机号码(11位)",
      trigger,
    },
  ];
};

// 邮箱校验
export const EmailRules = (message = "请输入邮箱", trigger = "") => {
  return [
    {
      required: true,
      message, // 请输入xxx
      trigger,
    },
    {
      required: true,
      pattern: EMAIL_REG,
      message: "请输入正确格式规则的邮箱",
      trigger,
    },
  ];
};

// 版本号校验;
export const VersionRules = (message = "请输入版本号", trigger = "") => {
  return [
    {
      required: true,
      message,
      trigger,
    },
    {
      required: true,
      pattern: VERSION_REG,
      message: "请输入格式xx.xx.xx的版本号",
      trigger,
    },
  ];
};

// 版本号含字母校验;
export const VersionEnRules = (message = "请输入版本号", trigger = "") => {
  return [
    {
      required: true,
      message,
      trigger,
    },
    {
      required: true,
      pattern: VERSION_EN_REG,
      message: "请输入格式xx.xx.xx的版本号",
      trigger,
    },
  ];
};


// wifi校验
export const WifiRules = (
  message = "请输入wifi名",
  min = 1,
  max = 4,
  trigger = ""
) => {
  return [
    {
      required: true,
      message,
      trigger,
    },
    {
      required: true,
      min,
      max,
      message: `字符长度在${min}-${max}`,
      trigger,
    },
    {
      required: true,
      pattern: EN_NUMBER___REG,
      message: "请输入英文,数字,下划线的wifi名,不能使用空格和其他符号",
      trigger,
    },
  ];
};

// 密码校验
export const PassWordRules = (message = "请输入密码", trigger = "") => {
  return [
    {
      required: true,
      message,
      trigger,
    },
    {
      required: true,
      min: 8,
      max: 50,
      message: `字符长度在8-50`,
      trigger,
    },
    {
      required: true,
      pattern: NUMBER_EN_SYM_REG,
      message: "请输入英文,数字或常用符号的密码",
      trigger,
    },
    {
      required: true,
      pattern: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d).*$/g,
      message: "密码必须要有英文字母大小写和数字",
      trigger,
    },
  ];
};

// 账号校验
export const AccountRules = (message = "请输入账号", trigger = "") => {
  return [
    {
      required: true,
      message,
      trigger,
    },
    {
      required: true,
      min: 1,
      max: 50,
      message: `字符长度在1-50`,
      trigger,
    },
    {
      required: true,
      pattern:
        /^([A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4})|([1][3,4,5,6,7,8,9][0-9]{9})$/,
      message: "请输入国内11位手机号或者邮箱",
      trigger,
    },
  ];
};
