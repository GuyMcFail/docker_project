import React from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import {Link} from 'react-router-dom';

export default class POItems extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      product_list: [],
      vendor: '',
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.recieveProduct = this.recieveProduct.bind(this);
  }

  componentDidMount(){
    this.getProductData();
  }

  getProductData(){
    const headers = {
      'Content-Type': 'text/plain',
    }
    axios.get(`http://localhost:5000/po-products/${this.props.match.params.poId}`, { headers })
    .then((resp) => {
      this.setState({
        product_list: resp.data
      })
      console.log(resp);
    }).catch(err => {
      console.error(err);
    })
  }

  addProduct(){
    if (!this.state.name || !this.state.desc || !this.state.qty){
      alert("Missing Data")
      return
    }
    const data = {
      name:this.state.name,
      description:this.state.desc,
      qty:this.state.qty
    }

    axios.post(
      `http://localhost:5000/po-products/${this.props.match.params.poId}`,
      data,
    )
    .then((resp) => {
      this.getProductData();
      console.log(resp);
    }).catch(err => {
      console.error(err);
    })
  }

  recieveProduct(id){
    axios.put(
      `http://localhost:5000/po-products/${id}`
    )
    .then((resp) => {
      this.getProductData();
      console.log(resp);
    }).catch(err => {
      console.error(err);
    })
  }


  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({[name]: value});
  }

  handleSubmit(event){
    this.addProduct();
    event.preventDefault();
    this.setState({vendor: ''});
  }

  render(){
    return(
      <>
      <Form onSubmit={this.handleSubmit}>
        <Row>
          <Col xs="auto">
            <Form.Control
              name="name"
              placeholder="Name"
              value={this.state.name}
              onChange={this.handleChange}
              maxLength="10"
            />
          </Col>
          <Col xs="auto">
            <Form.Control
              name="desc"
              placeholder="Description"
              value={this.state.desc}
              onChange={this.handleChange}
              maxLength="255"
            />
          </Col>
          <Col xs="auto">
            <Form.Control
              name="qty"
              placeholder="qty"
              value={this.state.qty}
              onChange={this.handleChange}
              maxLength="3"
            />
          </Col>
          <Col xs="auto">
            <Button type="submit" className="mb-2">
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
      <Table striped bordered hover>
        <thead>
        <th>PART #</th>
        <th>DESCRIPTION</th>
        <th>QTY</th>
        <th>RECIEVED</th>
        </thead>
        <tbody>
        {
            this.state.product_list.map((po, index) => {
              return (
                <tr key={index} onClick={() => {}}>
                  <td className="col-sm-6 col-md-4 col-lg-3">
                    {po.prodName}</td>
                  <td className="col-sm-6 col-md-4 col-lg-3">
                    {po.prodDescription}</td>
                  <td className="col-sm-6 col-md-4 col-lg-3">
                    {po.qty}</td>
                  <td className="col-sm-6 col-md-4 col-lg-3">
                    {po.recieved ? 'Y' : 'N'}</td>
                  {!po.recieved
                    ? <td className="col-sm-6 col-md-4 col-lg-3">
                       <button className="btn btn-primary" onClick={() => this.recieveProduct(po.prodId)}>Recieve</button></td>
                    : <></>
                  }
                </tr>

              )
            })
        }
        </tbody>
      </Table>
      </>
    )
  }
}
