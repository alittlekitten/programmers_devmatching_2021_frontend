// ImageView를 생성하고, Nodes에서 File을 클릭 시 ImageView에 image url을 넘기는 방식
// 상수 처리
const IMAGE_PATH_PREFIX = 'https://fe-dev-matching-2021-03-serverlessdeploymentbuck-t3kpj3way537.s3.ap-northeast-2.amazonaws.com/public'

export default function ImageView({ $app, initialState }) {
    // image url
    this.state = initialState
    this.$target = document.createElement('div')
    this.$target.className = 'Modal ImageView'

    $app.appendChild(this.$target)

    this.setState = (nextState) => { // state 설정 - nextState가 매개변수로 들어오면 그 값이 this.state로 할당됨
        this.state = nextState
        this.render()
    }

    this.render = () => { // 이것도 이전(breadcrumb)과 비슷함 + 호이스팅
        this.$target.innerHTML = `<div class="content">${this.state ? `<img src="${IMAGE_PATH_PREFIX}${this.state}">` : ''}</div>` // this.state가 존재하면 innerHTML을 통해 div가 삽입되어 이미지를 출력, 아니면 공백

        this.$target.style.display = this.state ? 'block' : 'none' // style의 display값은 this.state에 따라 block 아니면 none으로 나뉨 (state 여부에 따라 display가 되냐 마냐 결정)
    }

    this.render()
}