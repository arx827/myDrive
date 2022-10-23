# React Hooks
React 是主流的前端框架，v16.8 版本引入了全新的API，叫做React Hooks，顛覆了以前的用法。

## 一、組件類的缺點
  React 的核心是組件。v16.8 版本之前，組件的標準寫法是類（class）。下面是一個簡單的組件類。
  
  ```js
  import React, { Component } from "react";

  export default class Button extends Component {
    constructor() {
      super();
      this.state = { buttonText： "Click me, please" };
      this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
      this.setState(() => {
        return { buttonText: "Thanks, been clicked!" };
      });
    }
    render() {
      const { buttonText } = this.state;
      return <button onClick={this.handleClick}>{buttonText}</button>;
    }
  }
  ```

  `Redux` 的作者`Dan Abramov`總結了組件類的幾個缺點。
  - 大型組件很難拆分和重構，也很難測試。
  - 業務邏輯分散在組件的各個方法之中，導致重複邏輯或關聯邏輯。
  - 組件類引入了複雜的編程模式，比如render props 和高階組件。

## 二、函數組件
  React 團隊希望，組件不要變成複雜的容器，最好只是數據流的管道。開發者根據需要，組合管道即可。組件的最佳寫法應該是函數，而不是類。

  React 早就支持`函數組件`，下面就是一個例子。
  ```js
  function Welcome(props) {
    return <h1>Hello, {props.name}</h1>;
  }
  ```
  但是，這種寫法有重大限制，必須是純函數，不能包含狀態，也不支持生命週期方法，因此無法取代類。

  `React Hooks` 的設計目的，就是加強版函數組件，完全不使用"類"，就能寫出一個全功能的組件。

## 三、Hook 的含義
  Hook 這個單詞的意思是"鉤子"。

  **React Hooks** 的意思是，組件盡量寫成純函數，如果需要外部功能和副作用，就用鉤子把外部代碼"鉤"進來。React Hooks 就是那些鉤子。

  需要什麼功能，就使用什麼鉤子。React 默認提供了一些常用鉤子，也可以封裝自己的鉤子。

  所有的鉤子都是為函數引入外部功能，所以React 約定，鉤子一律使用`use`前綴命名，便於識別。要使用xxx 功能，鉤子就命名為`usexxx`。

  下面介紹React 默認提供的四個最常用的鉤子。
  - useState()
  - useContext()
  - useReducer()
  - useEffect()

## 四、useState()：狀態鉤子
  `useState()` 用於為函數組件引入狀態（state）。純函數不能有狀態，所以把狀態放在鉤子裡面。

  ```js
  import React, { useState } from "react";

  export default function  Button()  {
    const  [buttonText, setButtonText] =  useState("Click me,   please");

    function handleClick()  {
      return setButtonText("Thanks, been clicked!");
    }

    return  <button  onClick={handleClick}>{buttonText}</button>;
  }
  ```
  上面代碼中，Button 組件是一個函數，內部使用`useState()`鉤子引入狀態。

  `useState()`這個函數接受狀態的初始值，作為參數，上例的初始值為按鈕的文字。該函數返回一個數組，數組的第一個成員是一個變量（上例是`buttonText`），指向狀態的當前值。第二個成員是一個函數，用來更新狀態，約定是`set`前綴加上狀態的變量名（上例是`setButtonText`）。

## 五、useContext()：共享狀態鉤子
  如果需要在組件之間共享狀態，可以使用useContext()。
  現在有兩個組件Navbar 和Messages，我們希望它們之間共享狀態。

  ```js
  <div className="App">
    <Navbar/>
    <Messages/>
  </div>
  ```

  第一步就是使用React Context API，在組件外部建立一個Context。
  ```js
  const AppContext = React.createContext({});
  ```

  組件封裝代碼如下。
  ```js
  <AppContext.Provider value={{
    username: 'superawesome'
  }}>
    <div className="App">
      <Navbar/>
      <Messages/>
    </div>
  </AppContext.Provider>
  ```
  上面代碼中，`AppContext.Provider`提供了一個Context 對象，這個對象可以被子組件共享。

  Navbar 組件的代碼如下。
  ```js
  const Navbar = () => {
    const { username } = useContext(AppContext);
    return (
      <div className="navbar">
        <p>AwesomeSite</p>
        <p>{username}</p>
      </div>
    );
  }
  ```
  上面代碼中，`useContext()`鉤子函數用來引入Context 對象，從中獲取`username`屬性。

  Message 組件的代碼也類似。
  ```js
  const Messages = () => {
    const { username } = useContext(AppContext)

    return (
      <div className="messages">
        <h1>Messages</h1>
        <p>1 message for {username}</p>
        <p className="message">useContext is awesome!</p>
      </div>
    )
  }
  ```

## 六、useReducer()：action 鉤子
  React 本身不提供狀態管理功能，通常需要使用外部庫。這方面最常用的庫是Redux。

  Redux 的核心概念是，組件發出action 與狀態管理器通信。狀態管理器收到action 以後，使用Reducer 函數算出新的狀態，Reducer 函數的形式是`(state, action) => newState`。

  `useReducers()`鉤子用來引入Reducer 功能。

  ```js
  const [state, dispatch] = useReducer(reducer, initialState);
  ```
  上面是`useReducer()`的基本用法，它接受Reducer 函數和狀態的初始值作為參數，返回一個數組。數組的第一個成員是狀態的當前值，第二個成員是發送action 的`dispatch`函數。

  下面是一個計數器的例子。用於計算狀態的Reducer 函數如下。
  ```js
  const myReducer = (state, action) => {
    switch(action.type)  {
      case('countUp'):
        return  {
          ...state,
          count: state.count + 1
        }
      default:
        return  state;
    }
  }
  ```
  組件代碼如下。
  ```js
  function App() {
    const [state, dispatch] = useReducer(myReducer, { count:   0 });
    return  (
      <div className="App">
        <button onClick={() => dispatch({ type: 'countUp' })}>
          +1
        </button>
        <p>Count: {state.count}</p>
      </div>
    );
  }
  ```
  > 由於Hooks 可以提供共享狀態和Reducer 函數，所以它在這些方面可以取代Redux。但是，它沒法提供中間件（middleware）和時間旅行（time travel），如果需要這兩個功能，還是要用Redux。

## 七、useEffect()：副作用鉤子
  `useEffect()`用來引入具有副作用的操作，最常見的就是向服務器請求數據。以前，放在`componentDidMount`裡面的代碼，現在可以放在`useEffect()`。

  `useEffect()`的用法如下。
  ```js
  useEffect(()  =>  {
    // Async Action
  }, [dependencies])
  ```
  上面用法中，`useEffect()`接受兩個參數。
  第一個參數是一個函數，異步操作的代碼放在裡面。
  第二個參數是一個數組，用於給出Effect 的依賴項，只要這個數組發生變化，`useEffect()`就會執行。
  第二個參數可以省略，這時每次組件渲染時，就會執行`useEffect()`。

  下面看一個例子。
  ```js
  const Person = ({ personId }) => {
    const [loading, setLoading] = useState(true);
    const [person, setPerson] = useState({});

    useEffect(() => {
      setLoading(true); 
      fetch(`https://swapi.co/api/people/${personId}/`)
        .then(response => response.json())
        .then(data => {
          setPerson(data);
          setLoading(false);
        });
    }, [personId])

    if (loading === true) {
      return <p>Loading ...</p>
    }

    return <div>
      <p>You're viewing: {person.name}</p>
      <p>Height: {person.height}</p>
      <p>Mass: {person.mass}</p>
    </div>
  }
  ```
  上面代碼中，每當組件參數`personId`發生變化，`useEffect()`就會執行。
  組件第一次渲染時，`useEffect()`也會執行。

## 八、創建自己的Hooks
  上例的Hooks 代碼還可以封裝起來，變成一個自定義的Hook，便於共享。
  ```js
  const usePerson = (personId) => {
    const [loading, setLoading] = useState(true);
    const [person, setPerson] = useState({});
    useEffect(() => {
      setLoading(true);
      fetch(`https://swapi.co/api/people/${personId}/`)
        .then(response => response.json())
        .then(data => {
          setPerson(data);
          setLoading(false);
        });
    }, [personId]);  
    return [loading, person];
  };
  ```
  上面代碼中，`usePerson()`就是一個自定義的Hook。

  Person 組件就改用這個新的鉤子，引入封裝的邏輯。
  ```js
  const Person = ({ personId }) => {
    const [loading, person] = usePerson(personId);

    if (loading === true) {
      return <p>Loading ...</p>;
    }

    return (
      <div>
        <p>You're viewing: {person.name}</p>
        <p>Height: {person.height}</p>
        <p>Mass: {person.mass}</p>
      </div>
    );
  };
  ```

## 補充
  ### 有狀態與無狀態組件
    React 中的組件可以是有狀態的或無狀態的。
    - 有狀態組件在其中聲明和管理本地狀態。
    - 無狀態組件是一個純函數，沒有本地狀態和副作用需要管理。

    如果我們從功能組件中取出有狀態和副作用邏輯，我們就有了一個無狀態組件。此外，有狀態和副作用邏輯可以在應用程序的其他地方重用。因此，盡可能地將它們與組件隔離是有意義的。

  ### React Hooks 和有狀態的邏輯
    使用 React Hooks，我們可以將有狀態的邏輯和副作用與功能組件隔離開來。Hooks 是 JavaScript 函數，通過將它們與組件隔離開來管理狀態的行為和副作用。

    因此，我們現在可以將所有有狀態的邏輯隔離在鉤子中，並在組件中使用（組合它們，因為鉤子也是函數）。

  ### React 提供了一堆標準的內置鉤子：
  **useState**： 管理狀態。返回一個有狀態的值和一個更新函數來更新它。
  **useEffect**：管理 API 調用、訂閱、計時器、突變等副作用。
  **useContext**：返回上下文的當前值。
  **useReducer**：`useState`幫助進行複雜狀態管理的替代方法。
  **useCallback**：它返回回調的記憶版本，以幫助子組件不會不必要地重新渲染。
  **useMemo**：它返回一個有助於優化性能的記憶值。
  **useRef**： 它返回一個帶有`.current`屬性的 ref 對象。ref 對像是可變的。它主要用於命令式地訪問子組件。
  **useLayoutEffect**：它在所有 DOM 突變結束時觸發。最好`useEffect`盡可能多地使用這個，因為`useLayoutEffect`同步觸發。
  **useDebugValue**：幫助在 React DevTools 中顯示自定義掛鉤的標籤。

