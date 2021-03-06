const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second]
    .map(formatNumber)
    .join(':')}`;
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : `0${n}`;
};

/**
 * @description: 族谱数据格式化
 * @param {array} list 人员列表
 * @param {number} level 世数
 * @param {object} parent 父亲
 * @param {function} cb 回调函数, 返回一个对象来接收其他属性
 * @return {array} 返回一个新的数组
 */
const formatTreeData = (list, level = 1, parent = null, cb = () => {}) => {
  if (!list || !list.length) return [];

  const data = list.map(item => {
    const { info, name } = item;
    const completeName = name === '名讳' && name.length < 4 ? name : '申' + name;
    info.trim();
    let userInfo = {
      name: completeName,
      sex: 1, // 1男 2女
      birthday: null, // 生日
      age: null, // 年龄
      level, // 世数
      parent, // 父亲
      children: formatTreeData(item.children, level + 1, completeName, cb),
    };

    const numReg = /\d+/g;
    const birthdayList = info.match(numReg);

    // 性别
    if ((info.includes('女') && info.includes('适')) || info.slice(0, 2).includes('女')) {
      userInfo.sex = 2;
    }
    // 生日
    if (birthdayList && birthdayList.length) {
      let birthday = birthdayList[0];

      if (birthday) {
        if (birthday.length === 6) {
          birthday = birthday.slice(0, 4) + '-' + birthday.slice(4, 6);
        }
        if (birthday.length === 8) {
          birthday = birthday.slice(0, 4) + '-' + birthday.slice(4, 6) + '-' + birthday.slice(6, 8);
        }
      }
      userInfo.birthday = birthday;
    }
    // 年龄
    if (birthdayList && birthdayList.length) {
      if (userInfo.birthday.length >= 4) {
        const currentYear = new Date().getFullYear();
        const birthdayYear = Number(userInfo.birthday.split('-')[0]);
        const age = currentYear - birthdayYear;

        userInfo.age = age;
      }
    }

    return {
      ...item,
      ...userInfo,
      ...cb({
        ...item,
        ...userInfo,
      }),
    };
  });

  return data;
};

module.exports = {
  formatTime,
  formatTreeData,
};
