let delCoordiflag = false;

///저장된 코디 중 하나를 삭제
function deleteCoordi(){
    if(delCoordiflag) return; //이미연결되어있으면 실행X (방어로직)
    delCoordiflag = true;

    document.getElementById("coordiList").addEventListener("click", function(e){
        
        if(e.target.classList.contains("delete_coordi")){
            let id = parseInt(e.target.dataset.id);
            //console.log("삭제할 코디 id: "+id);
            
            if(confirm("이 코디를 삭제하시겠습니까?")){
                let tx = db.transaction("coordi", "readwrite");
                let store = tx.objectStore("coordi");
                store.delete(id);
                    
                tx.oncomplete = function(){
                    alert("삭제되었습니다.");
                    renderCoordiPreview(); //화면 다시 그리기
                };
            } else {
                alert("삭제가 취소되었습니다.")
            }
        }
    });
}

//코디 제목, 그리드 레이아웃, 원피스 숨김 처리, 삭제 버튼
function renderCoordiPreview(){
    //console.log("renderCoordiPreview 실행됨!");
    let coordiContainer = document.getElementById("coordiList");
    coordiContainer.innerHTML="";

    let txCoordi = db.transaction("coordi", "readonly");
    let storeCoordi = txCoordi.objectStore("coordi");
    let requestCoordi = storeCoordi.getAll();

    requestCoordi.onsuccess = function(){
        //console.log("IndexedDB 연결 성공");
        let coordiList = requestCoordi.result;

        if(coordiList.length==0){
            coordiContainer.innerHTML="<p>저장된 코디가 없습니다.</p>"
            return;
        }

        let txCloset = db.transaction("clothes", "readonly");
        let storeCloset = txCloset.objectStore("clothes");
        let requestCloset = storeCloset.getAll();

        requestCloset.onsuccess = function(){
            let closetData = requestCloset.result;

            for(let i=0; i<coordiList.length; i++){
                let coordi = coordiList[i]; //코디 한 세트
                //console.log(coordi);
                // 1. 코디 카드
                let coordiCard = document.createElement("div"); //코디카드
                coordiCard.className = "coordi-result";
                
                // 2. 코디 제목
                let title = document.createElement("h4");
                title.innerHTML = coordi.title;
                coordiCard.appendChild(title);
        
                // 3. 코디 미리보기 박스 + 카테고리별 박스 만들기
                let {preview, slots} = coordiSlots(); // ✅ 비구조화 할당
                /*let result = CoordiSlots();
                let preview = result.preview;
                let slots = result.slots;*/
        
                /*4. 코디에 포함된 옷들 이미지로 추가 
                코디에 들어있는 옷 id 목록을 하나씩 꺼내서
                실제 옷장 데이터에서 해당 id에 맞는 옷을 찾기*/
                for(let j=0; j<coordi.items.length; j++){
                    let itemId=coordi.items[j];
                    //console.log("itemId", itemId)
                    //console.log("closetData", closetData)
        
                    let item=null;
                    for(let k=0; k<closetData.length; k++){
                        //console.log("closetData[k].id", closetData[k].id);
        
                        if(String(closetData[k].id) == String(itemId)){
                            item = closetData[k];
                            break;
                        }
                    }
                    if(item!==null && slots[item.category]){
                        //console.log("item", item);
                        let img = document.createElement("img");
                        img.src = getImageURL(item.image);
                        img.className = "clothing-img";
                        img.alt = item.clothesname;
                        img.title = item.clothesname;
                        
                        if(item.category == "원피스"){
                            slots["원피스"].appendChild(img);
                        } else if(slots[item.category]){
                            //console.log("item.category: ", item.category);
                            //console.log("슬롯 존재여부", slots[item.category]);
                            slots[item.category].appendChild(img);
                        }
                    }
                }
                // ✅ 원피스가 포함되어 있으면 상의/하의 칸 숨기기
                let hasOnepiece = false;
                for (let n = 0; n < coordi.items.length; n++) {
                    let itemId = coordi.items[n];
                    for (let m = 0; m < closetData.length; m++) {
                        if (String(closetData[m].id) === String(itemId) && closetData[m].category == "원피스") {
                            hasOnepiece = true;
                            break;
                        }
                    }
                }
                if (hasOnepiece) {
                    preview.classList.add("has-onepiece");
                    if (slots["상의"]) slots["상의"].style.display = "none";
                    if (slots["하의"]) slots["하의"].style.display = "none";
                }
                // 이미지 없는 슬롯 숨기기
                let hiddenSlots = preview.querySelectorAll(".slot");
                for (let a = 0; a < hiddenSlots.length; a++) {
                    let img = hiddenSlots[a].querySelector("img");
                    if (img == null) {
                        hiddenSlots[a].style.display = "none";
                    }
                }
                let deleteBt = document.createElement("button");
                deleteBt.className ="delete_coordi";
                deleteBt.innerText ="✖";
                deleteBt.dataset.id = coordi.id;
        
                // 5. 박스 붙이기
                coordiCard.appendChild(preview);
                coordiCard.append(deleteBt);
        
                coordiContainer.appendChild(coordiCard);
            }
        };
    };
}

function coordiSlots(){
    let preview = document.createElement("div");
    preview.className = "coordi-preview";
    
    let slots = {}; //카테고리 박스 저장용 빈 객체 선언

    let categories = ["상의", "하의", "원피스", "아우터", "신발", "기타"];

    for(let i=0; i<categories.length; i++){
        let cate = categories[i];

        let box = document.createElement("div");
        box.className = "slot";
        //console.dir(box);
        box.dataset.category = cate;

        if(cate == "상의") box.classList.add("top"); //box.className = "slot top"이 됨
        if(cate == "하의") box.classList.add("bottom");
        if(cate == "원피스") box.classList.add("onepiece");
        if(cate == "아우터") box.classList.add("outer");
        if(cate == "신발") box.classList.add("shoes");
        if(cate == "기타") box.classList.add("etc");

        preview.appendChild(box);
        slots[cate] = box;
    }

    return{
        preview : preview,
        slots : slots
    };
}

//옷 목록을 코디용으로 렌더링 (선택 가능)
function renderForCoordi(){
    let coordiSpace = document.getElementById("coordiCloset");
    coordiSpace.innerHTML = "";

    let tx = db.transaction("clothes", "readonly");
    let store = tx.objectStore("clothes");
    let request = store.getAll();

    request.onsuccess = function(){
        let closet = request.result;

        // 최신순 정렬 (id 기준 내림차순)
        closet.sort(function(a, b) {
            return b.id - a.id;
        });

        for(let i=0; i<closet.length; i++){
            let item = closet[i];
            //console.log(item.name, item.category);

            let card = document.createElement("div");
            card.className="coordi-card"; // className: 중복 적용가능
            card.dataset.id = item.id;

            let imgUrl = getImageURL(item.image);
    
            card.innerHTML = `<img src="${imgUrl}" alt="${item.name || item.clothesname}" class="clothing-img">
            <p>${item.clothesname}</p>`;
            card.addEventListener("click", function(){
                card.classList.toggle("selected"); //toggle 켜기/끄기 자동 전환
            });
            coordiSpace.appendChild(card);
        }
    };
    
}

//선택한 옷들을 조합해서 코디로 저장
function myCoordi(){
    let select = document.querySelectorAll(".coordi-card.selected");

    if(select.length == 0){
        alert("코디할 옷을 선택해주세요!");
        return;
    }
    
    //코디 이름 짓기
    let title = prompt("코디 이름을 입력하세요:");
    if(title == null || title.trim() == ""){ //trim()공백만 입력했을 때 방지
        alert("코디 이름을 입력해야 저장됩니다.");
        return;
    }

    //선택한 코디 카드들의 id
    let selectIds = [];
    for(let i=0; i<select.length; i++){
        let id = parseInt(select[i].dataset.id);
        selectIds.push(id);
    }

    let tx = db.transaction("coordi", "readwrite");
    let store = tx.objectStore("coordi");


    //새 코디 조합 객체 만들기
    let newCoordi = {
        title : title,
        items : selectIds
    };
    
    store.add(newCoordi);

    tx.oncomplete = function(){
        alert("코디가 저장되었습니다!")
        renderCoordiPreview();
        renderForCoordi();
    }
}



