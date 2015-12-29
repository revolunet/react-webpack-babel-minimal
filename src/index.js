import React, { Component } from 'react'
import { render } from 'react-dom'
import { createHistory, useBasename } from 'history'
import { Router, Route, IndexRoute, Link } from 'react-router'

/*
    Basic example

*/

require('./app.css');

const PRODUCT_LIST = [{
    id: 1,
    name: 'Ukulele Tenor',
    price: 219
},{
    id: 2,
    name: 'Bass Guitar',
    price: 359
},{
    id: 3,
    name: 'Saxophone',
    price: 1990
}];

const history = useBasename(createHistory)({
  basename: '/'
})

class App extends Component {

  static title = 'Home'

  static path = '/'

  render() {
    const depth = this.props.routes.length

    return (
      <div>
        <aside>
          <ul>
            <li><Link to={Products.path}>Products</Link></li>
            <li><Link to={Orders.path}>Orders</Link></li>
          </ul>
        </aside>
        <main>
          <ul className="breadcrumbs-list">
            {this.props.routes.map((item, index) =>
              <li key={index}>
                <Link
                  onlyActiveOnIndex={true}
                  activeClassName="breadcrumb-active"
                  to={item.path || ''}>
                  {item.component.title}
                </Link>
                {(index + 1) < depth && '\u2192'}
              </li>
            )}
          </ul>
          {this.props.children}
        </main>
      </div>
    )
  }
}

class Products extends Component {
  static path = 'products'
  static title = 'Products'

  renderProduct = product => {
    return <li><Link to={ '/products/product/' + product.id} activeClassName="active">{product.name}</Link></li>
  }

  render() {
    return (
      <div className="Page">
        <h1>Products</h1>
        <ul>
            { PRODUCT_LIST.map(this.renderProduct) }
        </ul>
        {this.props.children}
      </div>
    )
  }
}

class Product extends React.Component {
  static path = 'product/:productId'
  static title = 'Product'
  render() {
    const product = PRODUCT_LIST.filter(product => product.id === parseInt(this.props.params.productId, 10))[0];
    return (
      <div className="Product">
        <h1>{product.name}</h1>
        <h3>{product.price} €</h3>
        {this.props.children}
      </div>
    )
  }
}

const Orders = () => <div className="Page"><h1>Orders</h1>No orders yet</div>;
Orders.title = 'Orders';
Orders.path = '/orders';

const Home = () => <h3>Welcome home :)</h3>;

render((
  <Router history={history}>
    <Route path={App.path} component={App}>
      <IndexRoute component={Home}/>
      <Route path={Products.path} component={Products}>
        <Route path={Product.path} component={Product}/>
      </Route>
      <Route path={Orders.path} component={Orders} />
    </Route>
  </Router>
), document.getElementById('root'))
