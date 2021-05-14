// api.js

// api end point를 상수처리 해두면 나중에 변경 되었을 경우 처리하기 쉬움
const API_END_POINT = '...' 

// fetch()로부터 반환되는 Promise객체는 HTTP error 상태를 reject하지 않으므로 http 요청중 에러가 발생하더라도 Promise의 catch로 떨어지지 않는다.
// 요청이 정말 성공했는지 체크하려면, response.ok가 true인지를 체크해야한다 (아래의 if문)

// Promise 버전

// const request = (nodeId) => {
//   // nodeId 유무에 따라 root directory를 조회할지 특정 directory를 조회할지 처리
//   fetch(`${API_END_POINT}/${nodeId ? nodeId : ''}`)
//     .then((response) => {
//       if (!response.ok) { // 정상적으로 불러오지 못한다면
//         throw new Error('서버의 상태가 이상합니다!')
//       }
//       return response.json()
//     })
//     .catch((e) => {
//       throw new Error(`무언가 잘못 되었습니다! ${e.message}`)
//     })
// }


// async await 버전! (ES2015/ES6 이후)
// request는 nodeId를 파라미터로 받고, 정상적으로 받아왔다면 비동기로 fetch로 가져온 데이터의 json을 불러온다
export const request = async (nodeId) => {
    try {
       const res = await fetch(`${API_END_POINT}/${nodeId ? nodeId : ''}`) // 받아올 때까지 기다린다
   
       if (!res.ok) { // 잘 받아오지 못했다면
         throw new Error('서버의 상태가 이상합니다!') // 에러 
       }
   
       return await res.json() // json 가져와서 return!
     } catch(e) { // 에러가 발생했다면
       throw new Error(`무언가 잘못 되었습니다! ${e.message}`) // 에러메시지 출력
     }
   }