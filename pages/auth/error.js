import Layout from 'components/layout'

const AuthErrorPage = () => {
  return (
    <Layout>
      <div className='fx__fade-in'>
        <h1>Authentication error</h1>
        <p className='clear'>An error occured during authentication.</p>
      </div>
    </Layout>
  )
}

export default AuthErrorPage
