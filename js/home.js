let editflag = false;
let delflag = false;

//출력한 카드 수정
function editClothes(){  
    if(editflag) return;
    editflag = true;
    
    document.getElementById("closetList").addEventListener("click", function(e){
        if(e.target.classList.contains("edit_bt")){
            
            let id = parseInt(e.target.dataset.id);
    
            //IndexedDB에서 해당 옷 가져오기
            let tx = db.transaction("clothes", "readonly");
            let store = tx.objectStore("clothes");
            let request = store.get(id);
    
            request.onsuccess = function(){
                let item = request.result;
    
                // 등록 폼에 기존 값 채우기
                document.getElementById("edit").value = item.id;
                document.getElementById("clothesname").value = item.clothesname;
                document.getElementById("category").value = item.category;
                document.getElementById("season").value = item.season;
                document.getElementById("pattern").value = item.pattern;
    
                // 색상 팔레트 반영
                let colors = document.querySelectorAll("#colorPalette .color-option");
                for(let j=0; j<colors.length; j++){
                    colors[j].classList.remove("selected");
                    if(colors[j].dataset.color == item.color){
                        colors[j].classList.add("selected");
                        document.getElementById("color").value = item.color;
                        document.getElementById("selectedColorText").innerText = `선택된 색상: ${item.color}`;
                    }
                }
                showView("addView");
            };
        }
    });
}

//출력한 카드 삭제
function deleteClothes(){
    if(delflag) return; //이미연결되어있으면 실행X (방어로직)
    delflag = true;

    document.getElementById("closetList").addEventListener("click", function(e){ 
        //부모에 걸어서 이벤트 한 번만 등록하도록
        if(e.target.classList.contains("delete_bt")){
            let id = parseInt(e.target.dataset.id);
        
            if(confirm("삭제하시겠습니까?")){
                let tx = db.transaction("clothes", "readwrite");
                let store = tx.objectStore("clothes");
                store.delete(id);
                
                tx.oncomplete = function(){
                    alert("삭제되었습니다.");
                    renderCloset();
                };
            } else {
                alert("삭제가 취소되었습니다.")
            }
        }
    });
}

// 등록된 옷 전체 출력 (정렬만 적용)
function renderCloset() {
    let closetList = document.getElementById("closetList");
    closetList.innerHTML = "";
    let sortOrder = document.getElementById("sortOrder").value; //"최신순" 또는 "오래된순"으로 정렬

    let tx = db.transaction("clothes", "readonly"); //render하는 곳이니까
    let store = tx.objectStore("clothes");
    let request = store.getAll();

    request.onsuccess = function () {
        let clothes=request.result;

        // 정렬: 최신순이면 id 큰 값부터, 오래된 순이면 id 작은 값부터
        if (sortOrder == "desc") {
            clothes.sort(function(a, b) {
                return b.id - a.id;
            });
        } else if (sortOrder == "asc"){
            clothes.sort(function(a, b) {
                return a.id - b.id;
            });
        }

        for(let i=0; i<clothes.length; i++){
            let item = clothes[i];
        
            let imgURL = getImageURL(item.image);

            let card = document.createElement("div");
            card.className = "clothing-card";

            card.innerHTML = `
                <div class="card-content">
                    <img src="${imgURL}" alt="${item.clothesname}" class="clothing-img">
                    <h3>${item.clothesname}</h3>
                    <p>카테고리: ${item.category}</p>
                    <p>계절: ${item.season}</p>
                    <p>색상: ${item.color}</p>
                    <p>패턴: ${item.pattern}</p>
                    <button class="edit_bt" data-id="${item.id}">수정</button>
                </div>
                <button class="delete_bt" data-id="${item.id}">✖</button>
            `;

            closetList.appendChild(card);
        
        } 
            deleteClothes();
            editClothes();
    };
}

// 필터 적용된 옷만 출력
function renderFilteredCloset() {
    let closetList = document.getElementById("closetList");
    closetList.innerHTML = "";

    // 선택된 필터 값
    function filter(id) {
        let element = document.getElementById(id);
        return element ? element.value : "";
    }

    //필터 값 가져오기
    let selectedCategory = filter("filterCategory");
    let selectedSeason = filter("filterSeason");
    let selectedColor = filter("filterColor");
    let selectedPattern = filter("filterPattern");
    let sortOrder = document.getElementById("sortOrder").value;

    let tx = db.transaction("clothes", "readonly");
    let store = tx.objectStore("clothes");
    let request = store.getAll();

    request.onsuccess = function () {
        let clothes = request.result;
        let filtered = [];

        // 필터 조건에 맞는 항목 모으기
        for (let i = 0; i < clothes.length; i++) {
            let item = clothes[i];

            let categoryMatch = (selectedCategory == "" || selectedCategory == item.category);
            let seasonMatch = (selectedSeason == "" || selectedSeason == item.season);
            let colorMatch = (selectedColor == "" || selectedColor == item.color);
            let patternMatch = (selectedPattern == "" || selectedPattern == item.pattern);

            if (categoryMatch && seasonMatch && colorMatch && patternMatch) {
                filtered.push(item);
            }
        }
        // 정렬
        if (sortOrder === "desc") {
            filtered.sort(function (a, b) {
                return b.id - a.id;
            });
        } else {
            filtered.sort(function (a, b) {
                return a.id - b.id;
            });
        }

        if(filtered.length==0){
            closetList.innerHTML = "<p>해당 조건에 맞는 옷이 없습니다.</p>";
        } else {
            for(let i=0; i<filtered.length; i++){
                let item = filtered[i];
                let imgURL = getImageURL(item.image);
        
                let card = document.createElement("div");
                card.className = "clothing-card";

                card.innerHTML = `
                    <div class="card-content">
                        <img src="${imgURL}" alt="${item.clothesname}" class="clothing-img">
                        <h3>${item.clothesname}</h3>
                        <p>카테고리: ${item.category}</p>
                        <p>계절: ${item.season}</p>
                        <p>색상: ${item.color}</p>
                        <p>패턴: ${item.pattern}</p>
                        <button class="edit_bt" data-id="${item.id}">수정</button>
                    </div>
                    <button class="delete_bt" data-id="${item.id}">✖</button>
                `;
                closetList.appendChild(card);
            }
        }
            deleteClothes();
            editClothes();
    };
}

//필터 리셋
function resetFilter(){
    
    document.getElementById("filterCategory").value = "";
    document.getElementById("filterSeason").value = "";
    document.getElementById("filterColor").value = "";
    document.getElementById("filterPattern").value = "";

    clearColor();
}



