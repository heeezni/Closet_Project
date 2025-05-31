//IndexedDB 연결 및 초기화
let db;
function initDB(){
    let request = indexedDB.open("ClosetDB", 2); //(name, version)
    
    request.onupgradeneeded = function(e){
        db = e.target.result;

        if( !db.objectStoreNames.contains("clothes")){ //clothes 저장소가 없을 때만 새로 생성
            db.createObjectStore("clothes", { keyPath: "id", autoIncrement: true }); //저장소 생성
        }
        if( !db.objectStoreNames.contains("coordi")){
            db.createObjectStore("coordi", { keyPath: "id", autoIncrement: true });
        }
    };
    
    request.onsuccess = function(e){
        db = e.target.result;
        console.log("IndexedDB 연결 성공");
        
        //addExampleData();//발표용 예시데이터
    };
    
    request.onerror = function(e){
        console.error("IndexedDB 연결 실패. 이유: ", e.target.error);
    };
}
