import React from 'react'
import { BrowserRouter as Router, Redirect } from 'react-router-dom'

const index = () => {
    return (

        <Router>
            <Switch>
                <Route path='/' exact component={Home} />
                <Route path='/profil' exact component={Profil} />
                <Route path='/trending' exact component={Trending} />
                <Redirect to="/" />
            </Switch>
        </Router>
    )
}

export default index