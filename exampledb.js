function addExampleData() {
let exampleClothes = [
        {
          clothesname: "가방",
          category: "기타",
          season: "",
          color: "블랙",
          pattern: "무지",
          image: "res/bag.png"
        },
        {
          clothesname: "1932 야구 모자",
          category: "기타",
          season: "여름",
          color: "그레이",
          pattern: "무지",
          image: "res/hat.png"
        },
        {
          clothesname: "스퀘어 선글라스",
          category: "기타",
          season: "여름",
          color: "블랙",
          pattern: "무지",
          image: "res/glasses.png"
        },
        {
          clothesname: "운동화",
          category: "신발",
          season: "봄",
          color: "화이트",
          pattern: "무지",
          image: "res/shoes.png"
        },
        {
          clothesname: "다크 카고 팬츠",
          category: "하의",
          season: "가을",
          color: "차콜",
          pattern: "무지",
          image: "res/pants.png"
        },
        {
          clothesname: "슬리브리스 탑",
          category: "상의",
          season: "여름",
          color: "화이트",
          pattern: "무지",
          image: "res/top.png"
        },
        {
          clothesname: "원피스",
          category: "원피스",
          season: "여름",
          color: "핑크",
          pattern: "무지",
          image: "res/원피스.png"
        },
        {
          clothesname: "에코백",
          category: "기타",
          season: "",
          color: "크림",
          pattern: "무지",
          image: "res/에코백.png"
        },
        {
          clothesname: "가디건",
          category: "아우터",
          season: "가을",
          color: "화이트",
          pattern: "무지",
          image: "res/가디건.png"
        },
        {
          clothesname: "컨버스",
          category: "신발",
          season: "",
          color: "화이트",
          pattern: "무지",
          image: "res/흰컨버스.png"
        }
      ];


    let tx = db.transaction("clothes", "readwrite");
    let store = tx.objectStore("clothes");

    for (let i = 0; i < exampleClothes.length; i++) {
        store.add(exampleClothes[i]);
    }

    tx.oncomplete = function () {
        alert("예시 옷 데이터가 추가되었습니다!");
        renderCloset(); // 목록 갱신
    };
}
