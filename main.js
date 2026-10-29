/* HTML에서 defer로 불러오므로 DOM이 다 만들어진 뒤에 실행됩니다. */

/* ================================================================= */
/* 1. 다크모드 구현                                                   */
/* ================================================================= */

// 다크모드 토글 버튼 엘리먼트 가져오기
const darkModeToggle = document.getElementById('dark-mode-toggle');

// 사용자의 다크모드 선호 설정을 브라우저 스토리지에서 불러옵니다.
// 로드 시점에 이전에 선택했던 테마가 있다면 적용해 줍니다.
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
}

// 버튼 클릭 시 dark-mode 클래스를 body에 토글(추가/제거)합니다.
darkModeToggle.addEventListener('click', () => {
    // classList.toggle은 해당 클래스가 있으면 제거하고, 없으면 추가해주는 메서드입니다.
    document.body.classList.toggle('dark-mode');

    // 새로고침해도 다크모드 설정이 유지될 수 있도록 로컬 스토리지에 테마 상태를 저장합니다.
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});


/* ================================================================= */
/* 2. 방명록 관리 및 로컬스토리지 연동                                   */
/* ================================================================= */

// 방명록 데이터를 메모리에 담아두기 위한 배열입니다.
let guestbooks = [];

// DOM 엘리먼트들을 취득합니다.
const guestbookForm = document.querySelector('#contact form');
const nameInput = document.getElementById('name');
const messageInput = document.getElementById('message');
const guestbookList = document.getElementById('guestbook-list');
const noGuestbookMsg = document.getElementById('no-guestbook');
const saveStorageBtn = document.getElementById('save-storage-btn');

// 화면에 방명록 배열(guestbooks)을 다시 그리는(렌더링) 함수입니다.
function renderGuestbooks() {
    // 기존 리스트 내부를 깨끗이 비웁니다.
    guestbookList.innerHTML = '';

    // 방명록이 하나도 없는 경우 "등록된 방명록이 없습니다" 메시지를 띄웁니다.
    if (guestbooks.length === 0) {
        noGuestbookMsg.style.display = 'block';
        return;
    }

    // 방명록이 존재하면 메시지를 숨깁니다.
    noGuestbookMsg.style.display = 'none';

    // 배열을 순회하며 HTML 요소를 동적으로 생성해 화면에 추가합니다.
    guestbooks.forEach((item, index) => {
        // <li> 태그 생성
        const li = document.createElement('li');
        li.className = 'guestbook-item';

        // 이름 영역 <div> 생성 및 텍스트 대입
        const nameDiv = document.createElement('div');
        nameDiv.className = 'guestbook-name';
        // textContent를 사용해 XSS 공격을 예방합니다. (HTML 태그가 실행되지 않고 텍스트 그대로 노출됨)
        nameDiv.textContent = item.name + ' 님';

        // 내용 영역 <div> 생성 및 텍스트 대입
        const msgDiv = document.createElement('div');
        msgDiv.className = 'guestbook-message';
        msgDiv.textContent = item.message;

        // 개별 삭제(X) 버튼 생성
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '×';
        deleteBtn.title = '방명록 삭제';

        // 삭제 버튼 클릭 이벤트 등록
        deleteBtn.addEventListener('click', () => {
            // 사용자에게 진짜 삭제할 것인지 묻습니다 (confirm 메서드 사용)
            if (confirm(`'${item.name}' 님의 방명록을 삭제하시겠습니까?`)) {
                // splice(인덱스, 개수)로 메모리 상의 배열에서 해당 아이템을 제거합니다.
                guestbooks.splice(index, 1);

                // 삭제 후 로컬 스토리지도 동기화해야 새로고침해도 삭제된 상태가 유지됩니다.
                localStorage.setItem('savedGuestbooks', JSON.stringify(guestbooks));

                // 변경된 메모리 상태를 토대로 화면을 재렌더링합니다.
                renderGuestbooks();
            }
        });

        // 생성한 이름, 내용, 삭제 버튼 요소를 <li>의 자식으로 추가
        li.appendChild(nameDiv);
        li.appendChild(msgDiv);
        li.appendChild(deleteBtn);

        // 최종 완성된 <li>를 <ul> 목록에 추가
        guestbookList.appendChild(li);
    });
}

// [기능 A] 방명록 임시 등록 기능
guestbookForm.addEventListener('submit', (event) => {
    // <form>의 submit 이벤트는 기본적으로 페이지를 새로고침시키므로 막아줍니다.
    event.preventDefault();

    // 입력값 가져오기 (공백 제거: trim())
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    // 입력 유효성 검사
    if (!name || !message) {
        alert('이름과 내용을 모두 입력해 주세요!');
        return;
    }

    // unshift()는 배열 맨 앞(0번 인덱스)에 데이터를 삽입합니다.
    // 최신 방명록이 목록 맨 위에 보이도록 하기 위함입니다.
    guestbooks.unshift({ name, message });

    // 화면 갱신
    renderGuestbooks();

    // 입력 필드 초기화
    nameInput.value = '';
    messageInput.value = '';

    alert('방명록이 등록되었습니다. (새로고침 시 사라집니다. 영구적으로 저장하려면 [영구저장] 버튼을 눌러주세요!)');
});

// [기능 B] 로컬 스토리지에 영구 저장 기능
saveStorageBtn.addEventListener('click', () => {
    // 현재 입력창에 작성 중인 값을 가져옵니다.
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    // 1. 이름과 내용이 모두 작성된 경우: 목록에 추가하고 즉시 영구 저장합니다.
    if (name && message) {
        guestbooks.unshift({ name, message });

        nameInput.value = '';
        messageInput.value = '';
    }
    // 2. 둘 중 하나만 입력된 경우: 입력을 마저 완료하도록 안내합니다.
    else if (name || message) {
        alert('이름과 내용을 모두 입력한 후 영구저장 버튼을 눌러주세요!');
        return;
    }
    // 3. 둘 다 비어있는 경우: 기존에 임시 등록해둔 목록만 로컬 스토리지에 저장합니다.

    // localStorage는 문자열만 저장할 수 있으므로 JSON.stringify()로 직렬화합니다.
    localStorage.setItem('savedGuestbooks', JSON.stringify(guestbooks));

    // 화면 목록을 즉시 갱신합니다.
    renderGuestbooks();

    alert('방명록 목록이 브라우저 스토리지에 영구 저장되었습니다! 새로고침해도 유지됩니다.');
});

// [기능 C] 초기 로드 시 로컬 스토리지에서 데이터 불러오기
function loadSavedGuestbooks() {
    const savedData = localStorage.getItem('savedGuestbooks');
    if (savedData) {
        try {
            // 저장된 문자열을 JSON.parse()로 다시 배열로 역직렬화합니다.
            guestbooks = JSON.parse(savedData);
            renderGuestbooks();
        } catch (e) {
            console.error('데이터 파싱 오류:', e);
        }
    }
}

// 페이지가 열렸을 때 기존에 저장된 데이터 로딩 실행
loadSavedGuestbooks();