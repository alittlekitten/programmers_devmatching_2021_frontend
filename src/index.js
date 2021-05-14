// index.js
// 확장자까지 모두 써주어야 함
import App from '../App.js'

new App(document.querySelector('.app')) // App을 생성하여 App 컴포넌트를 사용 가능

// html에서 module처리했으므로 다른 코드에서는 import로 불러올 수 있도록 export 키워드를 추가