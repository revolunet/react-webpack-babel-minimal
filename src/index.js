import React, { Component } from 'react';
import { render } from 'react-dom';
import { createHistory, useBasename } from 'history';
import { Router, Route, IndexRoute, Link } from 'react-router';
import AsyncProps from 'async-props';
import axios from 'axios';

/*
    Basic example in a single file to make it contained
*/

require('./app.css');


let PRODUCTS;

const getProducts = cb => {
    // WTF
    // if (PRODUCTS) {
    //     console.log('cache', PRODUCTS);
    //     cb(null, {products: PRODUCTS});
    //     return;
    // }
    axios.get('/products.json').then(response =>{
        PRODUCTS = response.data;
        console.log('res', PRODUCTS);
        cb(null, {products: PRODUCTS});
    }).catch(() => {
        cb(null, {products: []});
    });
}

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
            <li><Link to={About.path}>About</Link></li>
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

  static title = 'Products'
  static path = 'products'

  static loadProps(params, cb) {
    getProducts(cb);
  }

  static propTypes = {
    products: React.PropTypes.array
  }

  static childContextTypes = {
    getProduct: React.PropTypes.func
  }

  getChildContext() {
    return {
      getProduct: productId => {
        console.log('getProduct', productId, this.props.products);
        return this.props.products.filter(product => product.id === productId)[0];
      }
    }
  }

  renderProductLink = product => {
    return <li key={'product-' + product.id}><Link to={ '/products/product/' + product.id} activeClassName="active">{product.name}</Link></li>
  }

  render() {
    return (
      <div className="Page">
        <h1>Products</h1>
        <ul>
            { this.props.products.map(this.renderProductLink) }
        </ul>
        {this.props.children}
      </div>
    )
  }
}

class ProductView extends React.Component {
  render() {
    return (
      <div className="Product">
        <h1>{this.props.name}</h1>
        <h3>{this.props.price} €</h3>
        {this.props.children}
      </div>
    )
  }
}

class Product extends React.Component {

  static title = 'Product'
  static path = 'product/:productId'

  static contextTypes = {
    getProduct: React.PropTypes.func.isRequired
  }

  render() {
    return <ProductView {...this.context.getProduct(parseInt(this.props.params.productId, 10))}/>;
  }
}

const Orders = () => <div className="Page"><h1>Orders</h1>No orders yet</div>;
Orders.title = 'Orders';
Orders.path = '/orders';

const About = () => <div className="Page"><h1>About</h1>No about yet</div>;
About.title = 'About';
About.path = '/about';

const Home = () => <h3>Welcome home :)</h3>;

render((
  <Router history={history} RoutingContext={AsyncProps}>
    <Route path={App.path} component={App}>
      <IndexRoute component={Home}/>
      <Route path={Products.path} component={Products}>
        <Route path={Product.path} component={Product}/>
      </Route>
      <Route path={Orders.path} component={Orders} />
      <Route path={About.path} component={About} />
    </Route>
  </Router>
), document.getElementById('root'))
