export default function Breadcrumb({ $app, initialState, onClick }) { // this가 가리키는것은 현재 객체
    this.state = initialState // 현재 상태는 initialState
    this.onClick = onClick
  
    this.$target = document.createElement('nav') // 현재 객체의 $target은 document에서 생성한 'nav'
    this.$target.className = 'Breadcrumb' // $target의 class명은 Breadcrumb;
    $app.appendChild(this.$target) // $app에다가 this.$target를 넣어줌(Child로)
  
    this.setState = nextState => { // this의 setState는 함수표현식 - 매개변수(nextState)로 들어온 친구를 this.state로 넣고 render함수 동작
      this.state = nextState
      this.render()
    }
  
    // 호이스팅 - this.$target에다가 HTML요소 삽입
    // this.state에 있는 요소에 map처리 - map의 매개변수는 콜백함수와 thisArg
    // 콜백함수는 node와 index를 받아서 <div class="nave-item"... 를 join으로 다 연결해서 삽입
    // root가 들어가고 그 다음에 이어서 쭉 index와 node.name을 가진 div들이 나열됨
    // index는 배열 내 현재값의 인덱스, node는 배열 내 값(객체)
    this.render = () => { 
      this.$target.innerHTML = `<div class="nav-item">root</div>${
        this.state.map( 
          (node, index) => `<div class="nav-item" data-index="${index}">${node.name}</div>`).join('')}`
    }

    // 여기서도 이벤트 위임을 이용합니다.
    this.$target.addEventListener('click', (e) => {
        const $navItem = e.target.closest('.nav-item') // 이벤트 위임 - 클릭한 요소로부터 해당 이벤트가 계속 상위로 전파

        if ($navItem) {
            const { index } = $navItem.dataset
            this.onClick(index ? parseInt(index, 10) : null)
        }
    })

    this.render();
}