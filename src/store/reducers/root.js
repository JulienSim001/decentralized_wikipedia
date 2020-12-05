export const UPDATE_USER = 'UPDATE_USER'
export const UPDATE_CONTENT = 'UPDATE_CONTENT'
export const CONNECT_ETHEREUM = 'CONNECT_ETHEREUM'

const initialState = {
  user: null,
  account: null,
  contract: null,
  content: "",
}

const updateUser = user => ({ type: UPDATE_USER, user })

const updateContent = content => ({ type: UPDATE_CONTENT, content })

const connectEthereum = ({ account, contract }) => ({
  type: CONNECT_ETHEREUM,
  account,
  contract,
})

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USER:
      const { user } = action
      return { ...state, user }
    case CONNECT_ETHEREUM:
      const { account, contract } = action
      return { ...state, account, contract }
      
    case UPDATE_CONTENT:
      const { content } = action
      return { ...state, content }
      
    default:
      return state
  }
}

export default rootReducer
export { updateUser, updateContent, connectEthereum }
