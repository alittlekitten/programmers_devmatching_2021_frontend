// Nodes 컴포넌트 - function 문법 버전
// 생성된 DOM을 어디에 append 할지를 $app 파라메터로 받기
// 파라메터는 구조 분해 할당 방식으로 처리
// https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment

// onClick은 함수이며, 클릭한 Node의 type과 id를 파라메터로 넘겨받도록 함
export default function Nodes({ $app, initialState, onClick, onBackClick }) {
    this.state = initialState
  
    // Nodes 컴포넌트를 렌더링 할 DOM을 this.$target 이라는 이름으로 생성
      this.$target = document.createElement('ul')
    $app.appendChild(this.$target)
  
    // state를 받아서 현재 컴포넌트의 state를 변경하고 다시 렌더링하는 함수
    this.setState = (nextState) => {
      this.state = nextState
      // render 함수 내에서 this.state 기준으로 렌더링을 하기 때문에,
      // 단순히 이렇게만 해주어도 상태가 변경되면 화면이 알아서 바뀜
      this.render()
    }

    this.onClick = onClick // onClick이라는 함수를 그대로 this.onClick으로 사용하겠다는 이야기
    this.onBackClick = onBackClick // onBackClick이라는 함수를 그대로 this.onBackClick으로 사용하겠다는 이야기

    // 파라메터가 없는 Nodes의 render 함수.
    // 현재 상태(this.state) 기준으로 렌더링 합니다.
    this.render = () => {
        if (this.state.nodes) { // state에 nodes가 존재하면
          // nodesTemplate는 map으로 돌려진 nodes를 담은 새로운 배열
          // node의 type이 'FILE'면 전자, 아니면 후자를 iconPath에 담음
          const nodesTemplate = this.state.nodes.map(node => {
            const iconPath = node.type === 'FILE' ? './assets/file.png' : './assets/directory.png'
            // 그 후 div를 담은 부분을 추가해서 리턴 - nodesTemplate에 담음
            return `
              <div class="Node" data-node-id="${node.id}">
                <img src="${iconPath}" />
                <div>${node.name}</div>
              </div>
            `
          }).join('')
          // this(객체)의 $target의 HTML에서 현재 state가 Root가 아니면 prev.png를 담은 div를 HTML에 넣고, ROOT면 prev.png를 제외한 부분만 HTML에 넣는다
          // root directory 렌더링이 아닌 경우 뒤로가기를 렌더링
          // 뒤로가기의 경우 data-node-id attribute를 렌더링하지 않음.
          this.$target.innerHTML = !this.state.isRoot ? `<div class="Node"><img src="/assets/prev.png"></div>${nodesTemplate}` : nodesTemplate
        }  
    
          // 렌더링된 이후 클릭 가능한 모든 요소에 click 이벤트 걸기
          this.$target.querySelectorAll('.Node').forEach($node => {
            $node.addEventListener('click', (e) => { // event(클릭)을 e로 표현(매개변수)
              // dataset을 통해 data-로 시작하는 attribute를 꺼내올 수 있음 (dataset은 읽기전용)
              // target은 이벤트 버블링의 최하위 자식 요소를 리턴
              // currentTarget은 부모 요소를 리턴한다. (이벤트가 바인딩된 요소)
              const { nodeId } = e.currentTarget.dataset

              // nodeId가 없는 경우 뒤로가기를 누른 케이스
              if(!nodeId){
                  this.onBackClick();
              }

              // find함수는 배열에서 조건에 맞는 값중 첫번째 값을 리턴
              // state의 nodes에 들어있는 요소들 중에서 node.id가 nodeId인 친구를 찾는다
              // 즉 클릭한 Node를 찾아서 selectedNode에 저장한다
              const selectedNode = this.state.nodes.find(node => node.id === nodeId)
              // 클릭한 요소가 있다면 this.onClick
              if (selectedNode) {
                this.onClick(selectedNode); // 선택된 노드의 type, id를 파라미터로 넘겨받음
              }
            })
          })
      }
  
    // 인스턴스화 이후 바로 render 함수를 실행하며 new로 생성하자마자 렌더링 되도록 할 수 있음
    this.render()
  }