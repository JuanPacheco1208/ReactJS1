import Proptypes from 'prop-types';

const Layout = ({children}) =>{
    return(
        <div>{children}</div>
    )
}

Layout.prototype = {
    children: Proptypes.element.isRequired
}