// 각 파일의 의존성에 맞게 import문으로 불러오기
import ImageView from './src/ImageView.js'
import Breadcrumb from './src/Breadcrumb.js'
import Nodes from './src/Nodes.js'
import Loading from './src/Loading.js'
import { request } from './api.js'

// default export 를 통해 내보낸 것을 기본값으로 가져올 수 있습니다. (object, function, class 등). export 와 상반된 import 명령어를 통해 기본값을 가져오는 것이 가능합니다.
// 모듈에서 하나의 멤버만 가져옵니다. 현재 범위 내에 myMember 이 들어갑니다.
// https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/import



// App.js
// nodeId: nodes 형태로 데이터를 불러올 때마다 이곳에 데이터를 쌓는다. - 캐싱 구현!!
const cache = {}



// App.js를 이용하면 App이 Breadcrumb, Node를 조율하는 형태
// 두 컴포넌트는 독립적으로 동작할 수 있게 된다. + 다른 곳에서 쉽게 재활용할 수 있다!

export default function App($app) {
    this.state = { // $app의 state객체를 정의
        isRoot: false,
        nodes: [],
        depth: [],
        selectedFilePath: null,
        isLoading: false
    }

    const breadcrumb = new Breadcrumb({ // new Breadcrumb를 통해 $app, initialState를 가진 breadcrumb라는 객체를 생성
        $app,
        initialState: this.state.depth,
        onClick: (index) => { // onClick이라는 내부 함수 정의
            if (index === null) { // 만약 index가 null이면
              this.setState({
                ...this.state,
                depth: [],
                nodes: cache.root
              })
              return
            }
        
            // breadcrumb에서 현재 위치를 누른 경우는 무시함
            if (index === this.state.depth.length - 1) {
              return
            }
        
            const nextState = { ...this.state } // 다음 state
            const nextDepth = this.state.depth.slice(0, index + 1) // 다음 깊이
        
            this.setState({ // 
              ...nextState,
              depth: nextDepth,
              nodes: cache[nextDepth[nextDepth.length - 1].id]
            })
          }
    })

    // imageView 사용
    const imageView = new ImageView({
        $app,
        initialState: this.state.selectedFilePath // selectedFilePath를 initialState로 초기화
    })

    // 로딩화면 띄우기


    // App 컴포넌트에도 setState 함수 정의하기
    this.setState = (nextState) => {
        this.state = nextState
        breadcrumb.setState(this.state.depth)
        nodes.setState({
            isRoot: this.state.isRoot,
            nodes: this.state.nodes
        })
        imageView.setState(this.state.selectedFilePath) // imageView를 setState하는 과정을 추가
        loading.setState(this.state.isLoading) // loading을 setState하는 과정을 추가
    }
    
    const nodes = new Nodes({ // new Nodes를 통해 $app, initialState객체를 가진 nodes라는 객체를 생성
        $app,
        initialState: {
            isRoot: this.state.isRoot,
            nodes: this.state.nodes
        },
        // onClick이라는 메서드(내부함수)는 node를 파라미터로 받고, 그 node의 type이 DIRECTORY면 처리, FILE이면 else if문으로 이동
        // 함수를 파라메터로 던지고, Nodes 내에서 click 발생시 이 함수를 호출하게 함.
        // 이러면 Nodes 내에선 click 후 어떤 로직이 일어날지 알아야 할 필요가 없음.
        onClick: async (node) => {
            try {
                if (node.type === 'DIRECTORY') { // 선택한게 디렉토리면
                    if (cache[node.id]) { // 캐시된 자료가 있으면 다시 매번 request를 돌릴 필요 없이 캐싱된 자료를 가져오면 된다!
                        this.setState({ // 캐싱된 자료(nextNodes)로 바로 설정
                            ...this.state,
                            depth: [...this.state.depth, node],
                            nodes: nextNodes
                        })
                    } else { // 그렇지 않으면 request함수를 통해서 정보를 받아와서 설정
                        const nextNodes = await request(node.id)
                        this.setState({
                            ...this.state,
                            depth: [...this.state.depth, node],
                            nodes: nextNodes
                        })
                        // cache update
                        cache[node.id] = nextNodes
                    }
                } else if (node.type === 'FILE') {
                    // 선택한게 파일이면 이미지 보기 처리하기
                    this.setState({
                        ...this.state,
                        selectedFilePath: node.filePath
                    })
                }
            }
            catch (e) {
                // 에러처리하기
            }
        },
        
        // 뒤로가기라는 메서드는 파라미터가 없다!
        onBackClick: async () => {
            try {
              // 이전 state를 복사하여 처리
              const nextState = { ...this.state }
              nextState.depth.pop() // depth에서 배열의 마지막 요소를 제거
            
              // nextState에서 pop 하고 남은 것들의 길이 -1 위치에 있는 값의 id를 반환하거나, nextState의 요소가 없다면 null을 prevNodeId에 넣는다
              const prevNodeId = nextState.depth.length === 0 ? null : nextState.depth[nextState.depth.length - 1].id 
        
              // prevNodeId가 null이면 root로 온 경우이므로 root 처리
              // 현재 구현된 코드에서는 불러오는 모든 데이터를 cache에 넣고 있으므로
              // 이전으로 돌아가는 경우 이전 데이터가 cache에 있어야 정상임
              if (prevNodeId === null) {
                const rootNodes = await request() // request를 통해 공백값을 넣었을 때의 값을 fetch한다
                this.setState({ // this의 setState 발동!
                  ...nextState,
                  isRoot: true,
                  nodes: cache[rootNodes]
                })
              } else {
                const prevNodes = await request(prevNodeId) // 값이 있다면 그 값을 넣어서 fetch
        
                  this.setState({
                    ...prevNodes,
                    isRoot: false,
                    nodes: cache[prevNodes]
                  })
              }       
            } catch(e) {
              // 에러처리
            }
        }
    })

    // init라는 내부함수에서 api.js에서 선언한 request를 돌려서 반환한 fetch로 받은 데이터의 json을 rootNodes에 할당해주고 this의 setState에 할당한 함수를 이용해 this.state를 초기화해준다.
    const init = async () => {
        try {
            this.setState({ // 먼저 로딩중을 띄우고(isLoading을 true로 바꿔줌)
                ...this.state,
                isLoading: true
             })
            const rootNodes = await request()
            this.setState({
                ...this.state,
                isRoot: true,
                nodes: rootNodes
            })
            // 캐시에 추가
            cache.root = rootNodes;
        } catch (e) {
            // 에러처리 하기
            this.onError(e);
        } finally { // 로딩 끝나면 isLoading을 다시 false로 바꿔줌
            this.setState({
              ...this.state,
              isLoading: false
            })
        }
    }

    init()
}

