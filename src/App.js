import React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Switch, Link, Route, useParams } from 'react-router-dom'
import * as Ethereum from './services/Ethereum'
import styles from './App.module.css'
import MediumEditor from 'medium-editor'
import 'medium-editor/dist/css/medium-editor.css'
import 'medium-editor/dist/css/themes/default.css'


const NewArticle = () => {
  const [editor, setEditor] = useState(null)
  const { contract, account } = useSelector(({ contract, account }) => { return { contract, account }}) 
  //const dispatch = useDispatch()
  
  useEffect(() => {
    setEditor(new MediumEditor(`.${styles.editable}`, { placeholder : { text : 'Type your article'} }))
  }, [setEditor])
  
  const handleSubmit = event => {
	contract.methods.addArticle(editor.getContent()).send({from : account})
  }
  
 return (
    <form onSubmit={handleSubmit}>
      <div className={styles.subTitle}>New article</div>
      <div className={styles.mediumWrapper}>
        <textarea className={styles.editable} />
      </div>
      <input type="submit" value="Submit" />
    </form>
  )
}

const Home = () => {
  return (
    <div className={styles.links}>
      <Link to="/">Home</Link>
      <Link to="/article/new">Add an article</Link>
      <Link to="/article/all">All articles</Link>
    </div>
  )
}

const ReadArticle = () => {
  let { id } = useParams(); 
  const [content, setContent] = useState([])
  const contract = useSelector(({ contract }) => contract)
  useEffect(() => {
    if (contract) {
      contract.methods.articleContent(id).call().then(setContent)
    }
  }, [contract, setContent, id])
  
  //return {content}
  return ( <div dangerouslySetInnerHTML={{__html: content}}/> )
}


const EditArticle = () => {
  let { id } = useParams(); 
  const [state, setState] = useState({content: "", editor: null})
  const { contract, account } = useSelector(({ contract, account }) => { return { contract, account }})
  
  useEffect(() => {
    if (contract) {
        contract.methods.articleContent(id).call().then(rep => setState({content: rep}));
    }
  }, [contract, setState, id])
  
  const editField = <div contenteditable='true' id="editField" className={styles.editable} dangerouslySetInnerHTML={{__html: state.content}} />
  
  const handleSubmit = event => {
  	var textField = document.querySelector('[contenteditable]');
	contract.methods.updateArticle(id, textField.innerHTML).send({from : account});
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.subTitle}>New article</div>
      <div className={styles.mediumWrapper}>
        {editField}
      </div>
      <input type="submit" value="Submit" />
    </form>
  )
}


const AllArticles = () => {
  const [articles, setArticles] = useState([])
  const contract = useSelector(({ contract }) => contract)
  useEffect(() => {
    if (contract) {
      contract.methods.getAllIds().call().then(setArticles)
    }
  }, [contract, setArticles])
  
  return <div>
  	{articles.map(article =>
  	  <div>
  		<Link to={`/article/read/${article}`}> Article {article} </Link>
  		<Link to={`/article/edit/${article}`}> Edit </Link>
  	  </div>
  	)}
  </div>
}

const NotFound = () => {
  return <div>Not found</div>
}

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(Ethereum.connect)
  }, [dispatch])
  return (
    <div className={styles.app}>
      <div className={styles.title}>Welcome to Decentralized Wikipedia</div>
      <Switch>
        <Route path="/article/new">
          <NewArticle />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/article/all">
          <AllArticles />
        </Route>
        <Route name="read" path="/article/read/:id" component={ReadArticle}/>
        <Route path="/article/edit/:id" component={EditArticle}/>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </div>
  )
}

export default App
