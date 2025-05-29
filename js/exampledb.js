function insertExampleData(){
  let tx = db.transaction("clothes", "readonly");
  let store = tx.objectStore("clothes");
  let request = store.count();

  request.onsuccess = function(){
    if(request.result == 0){
      console.log("초기 데이터 없음 → 예시 데이터 삽입");

      let exampleClothes = [
        {
          name: "까리한 가방",
          category: "기타",
          season: "사계절",
          color: "검정",
          pattern: "무지",
          image: "res/bag.png"
        },
        {
          name: "1932 야구 모자",
          category: "기타",
          season: "여름",
          color: "회색",
          pattern: "무지",
          image: "res/hat.png"
        },
        {
          name: "블랙 스퀘어 선글라스",
          category: "기타",
          season: "여름",
          color: "검정",
          pattern: "무지",
          image: "res/glasses.png"
        },
        {
          name: "운동화",
          category: "신발",
          season: "봄",
          color: "흰색",
          pattern: "무지",
          image: "res/shoes.png"
        },
        {
          name: "다크 카고 팬츠",
          category: "하의",
          season: "가을",
          color: "차콜",
          pattern: "무지",
          image: "res/pants.png"
        },
        {
          name: "슬리브리스 탑",
          category: "상의",
          season: "여름",
          color: "흰색",
          pattern: "무지",
          image: "res/top.png"
        }
      ];

      let tx2 = db.transaction("clothes", "readwrite");
      let store2 = tx2.objectStore("clothes");

      for(let i=0; i<exampleClothes.length; i++){
        store2.add(exampleClothes[i]);
      }

      tx2.oncomplete = function(){
        console.log("예시 옷 등록 완료");
        renderCloset(); //등록 후 렌더링
      };
    } else {
      console.log("이미 데이터 있음");
      renderCloset(); //기존 데이터만 보여줌
    }
  };
}


/* 
📁 발표용 프로젝트/
 ┣ 📁 res/
 ┃ ┣ bag.png
 ┃ ┣ hat.png
 ┃ ┣ glasses.png
 ┃ ┣ shoes.png
 ┃ ┣ pants.png
 ┃ ┗ top.png
 ┣ 📄 index.html
 ┣ 📄 app.js
 ┗ ...
 */
