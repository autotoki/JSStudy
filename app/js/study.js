/* profile을 관리합니다. */
function ItemStore () {
  this._items = [];
}

// ItemStore.prototype.add = function (profile) {
//   this._items.push(profile);
// }
// ItemStore.prototype.insert = function (idx, profile) {
//   this._items.splice(idx, 0, profile);
// }
// ItemStore.prototype.remove = function (profile) {
//   var idx = this._items.indexOf(profile);
//   this._items.splice(idx, 1);
// }
// ItemStore.prototype.item = function (idx) {
//   return this._items[idx];
// }



ItemStore.prototype = {

  add: function (profile) {
    this._items.push(profile);
  },
  insert: function (idx, profile) {
    this._items.splice(idx, 0, profile);
  },
  remove: function (profile) {
    var idx = this._items.indexOf(profile);
    this._items.splice(idx, 1);
  },
  item: function (idx) {
    return this._items[idx];
  }

};

function ListItemMaker (spec) {
  this._store = new ItemStore();
  this._spec = spec;
}
ListItemMaker.prototype = {
  store: function () {
    return this._store;
  },
  makeEl: function (idx) {

    // idx를 이용해서 store의 item을 가져온다.
    // template을 확인다.
    // 데이터(item)를 template에 binding 시켜준다.

    var item     = this._store.item(idx);
    var template = this._spec.template;

    var bindedTemplate = template.replace(/{.+?}/g, function (bindTarget) {

      var key = bindTarget.substring(1, bindTarget.length-1);

      switch (key) {
        case "css-gen":
          return item.gender === "M" ? "gen-m" : "gen-f";
        case "idx":
          return idx;
        default:
          return item[key];
      }

    });

    var el = document.createElement('div');
    el.innerHTML = bindedTemplate;

    return el;

  }
};


/******************

밑에 있는 코드는 Legacy code 임!!!!!

*******************/





function ProfileManager (spec) {
  this._profiles = [];
  this._template = spec.template;
  this._injectTarget = spec.target;
}

ProfileManager.prototype.add = function (profile) {
  console.log("프로필이 추가 됩니다.");
  this._profiles.push(profile);

  var idx = this._profiles.indexOf(profile);

  var tmp = this._template.replace(/{.+?}/g, function (item) {

    var key = item.substring(1, item.length-1);

    switch (key) {
      case "css-gen":
        return profile.gender === "M" ? "gen-m" : "gen-f";
      case "idx":
        return idx;
      default:
        return profile[key];
    }

  });

  var injectionTarget = document.getElementById(this._injectTarget);

  injectionTarget.innerHTML += tmp;

};
ProfileManager.prototype.getProfile = function (idx) {
  return this._profiles[idx];
}


// 레이어 오픈시 사용하는 객체
var choiLayer = {
  /*
   */
  getInputNames: function () {
    return ['pjName', 'pjGender', 'pjAddr', 'pjTel'];
  },
  open: function (pManager) {
    this._pManager = pManager;
    this._mode = "save";
    var el;

    var inputNames = this.getInputNames();

    // getInputNames로 부터 받은 name으로 설정된 input을 초기화.
    for (var i = 0; i < inputNames.length; i++) {

      var name = inputNames[i];
      var elements = document.getElementsByName(name);

      switch (elements.length) {
        case 0: // 예외처리!
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
  edit: function (idx) {

    this.open(pManager);
    this._mode = "update";
    this._editingIdx = idx;

    var el = null,
        value = null, profile = pManager.getProfile(idx);

    // 이름
    el = document.querySelector("input[name='pjName']");
    el.value = profile.name;

    // gender
    var genders = document.getElementsByName('pjGender');
    profile.gender === 'M'
      ? genders[0].checked = true
      : genders[1].checked = true;

    // 주소
    el = document.querySelector("input[name='pjAddr']");
    el.value = profile.address;

    // 전화번호
    el = document.querySelector("input[name='pjTel']");
    el.value = profile.tel;

  },
  delete: function () {
    alert('삭제해야해...');
  },
  close: function () {
    document.getElementById("Pop").style.display='none';
  },
  saveAndUpdate: function () {
    if (this._mode === "update") {
      this.update(this._editingIdx)
    } else  {
      this.save();
    }
  },
  update: function (idx) {
    alert(idx);
    var elements = document.querySelectorAll("table.board-list");
    var tbEl = elements[idx];
    console.log(tbEl);


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

    el = tbEl.querySelector("td");
    el.innerText = profile.name;

    this.close();

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

// // 수정 기능 만들기
//
// 10. 리스트에 버튼 추가
// 20. 버튼에 클릭 이벤트를 추가
// 25. 해당 정보를 수집한다.
// 30. choiLayer를 화면에 노출
// 40. choiLayer에 자동으로 입력
// 45. 입력한 입력필드의 값으로 profile 객체를 생성
// 46. 수정 중인 idx에 해당하는 table element를 가져옴.
// 47. table element에 profile 정보를 넣어준다.




// 캐러셀 만들기 배너
// 10. 영역을 잡는다. <div id='banner'>
// 20. 이미지를 영역에 안에 전부 집어넣는다.
// 30. 이미지를 일렬로 배치한다.
// 40. 일렬로 배치된 이미지를 감싸는 wrap div를 만든다. <div id='imgContainer'>
// 45. 3초마다 작업을 실행시킨다.
// 46. wrap div의 left를 이동

// var i = 0;
// setInterval(function () {
//   var w = document.getElementById('banner').clientWidth;
//   var wrap = getElementById('imgContainer').style = 'left: ' + (-w * i);
//   i = i + 1;
//   console.log('한장 이동!!!');
// }, 3000);


// 캐러셀 by fade in/out

// 10. 영역을 잡는다. <div id='banner'>
// 20. 이미지를 영역에 안에 전부 집어넣는다.
// 30. 집어넣은 이미지를 Array에 집어 넣는다.
// 45. 3초마다 작업을 실행시킨다.
// 50. 현재 보이는 사진을 fade out 뒤에 있는 사진을 fade in
