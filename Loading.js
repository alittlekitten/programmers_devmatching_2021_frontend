// Loading.js
export default function Loading({ $app, initialState }) { // 똑같이 동작하지만, 로딩할 때 nyan-cat.gif를 불러온다는 차이가 있다
    this.state = initialState
    this.$target = document.createElement('div')
    this.$target.className = "Loading Modal"
  
    $app.appendChild(this.$target);
  
    this.setState = (nextState) => {
      this.state = nextState
      this.render()
    }
  
    this.render = () => {
      this.$target.innerHTML = `<div class="content"><img src="./assets/nyan-cat.gif"></div>`
  
      this.$target.style.display = this.state ? 'block' : 'none'
    }
  
    this.render()
  }