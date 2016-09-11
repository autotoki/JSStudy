function ProfileManager (spec) {
  this._profiles = [];
  this._template = spec.template;
  this._injectTarget = spec.target;
}

ProfileManager.prototype.add = function (profile) {
  console.log("프로필이 추가 됩니다.");
  this._profiles.push(profile);

  var tmp = this._template.replace(/{.+?}/g, function (item) {

    var key = item.substring(1, item.length-1);

    switch (key) {
      case "css-gen":
        return profile.gender === "M" ? "gen-m" : "gen-f";
      default:
        return profile[key];
    }

  });

  var injectionTarget = document.getElementById(this._injectTarget);

  injectionTarget.innerHTML += tmp;

};



var choiLayer = {
  getInputNames: function () {
    return ['pjName', 'pjGender', 'pjAddr', 'pjTel'];
  },
  open: function (pManager) {
    this._pManager = pManager;
    var el;

    var inputNames = this.getInputNames();

    for (var i = 0; i < inputNames.length; i++) {

      var name = inputNames[i];
      var elements = document.getElementsByName(name);

      switch (elements.length) {
        case 0:

          break;
        case 1: {
          el = elements[0];

          switch (el.type) {
            default:
              el.value = null;
          }
        } break;
        default: { // 복수개 -> radio나 checkbox
          for (var j = 0; j < elements.length; j++) {
            el = elements[j];
            el.checked = false;
          }
        }
      }
    }

    document.getElementById("Pop").style.display='block';
  },
  close: function () {
    document.getElementById("Pop").style.display='none';
  },
  save: function () {
    // 저장 로직
    var el = null,
        value = null, profile = {};

    // 이름
    el = document.querySelector("input[name='pjName']");
    value = el.value;

    var kor_check = /([^가-힣ㄱ-ㅎㅏ-ㅣ\x20])/i;
    if (kor_check.test(value)) {
      alert("한글만 입력하셍");
      el.value = "";
      el.focus();
      return;
    }
    profile.name = value;

    // gender
    var genders = document.getElementsByName('pjGender');
    var gender_value;
    for(var i = 0; i < genders.length; i++){
        if(genders[i].checked){
            gender_value = genders[i].value;
        }
    }
    value = gender_value;
    profile.gender = value;

    // 주소
    el = document.querySelector("input[name='pjAddr']");
    value = el.value;
    profile.address = value;


    // 전화번호
    el = document.querySelector("input[name='pjTel']");
    value = el.value;
    var regExp = /^[0-9]+$/;
    if (!regExp.test(value)) {
      alert("숫자만 입력하셍");
      el.value = "";
      el.focus();
      return;
    }
    profile.tel = value;

    this._pManager.add(profile);

    this.close();
  }
};


// var injectionTarget = document.getElementById('injectionTarget');
// var listStr = "";
//
// var myProfile = {
//   "name": "강승철",
//   "age": 37,
//   gender: "M"
// };
//
// var chProfile = {
//   name: "최혜영",
//   age: 30,
//   gender: "F"
// };
//
// var parkProfile = {
//   name: "박영수",
//   age: 34,
//   gender: "M"
// }
//
//
// var profiles = [myProfile, chProfile, parkProfile];
//
// listStr += "<ul>"
//
// for (var i = 0; i < profiles.length; i++) {
//
//   if (profiles[i].age > 30 && profiles[i].age < 40) {
//     // console.log(profiles[i].name + "님은 늙으셨군요");
//     listStr += "<li>" +profiles[i].name + "님은 늙으셨군요" + "</li>"
//   } else {
//     // console.log(profiles[i].name + "님은 젋으시네요.");
//     listStr += "<li>" +profiles[i].name + "님은 젋으시네요" + "</li>"
//   }
//
// }
//
// listStr += "</ul>";
//
// injectionTarget.innerHTML = listStr;
