import React from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import {Link} from 'react-router-dom';

export default class POList extends React.Component {
  constructor(){
    super();
    this.state = {
      po_list: [],
      vendor: '',
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    this.getPoData();
  }

  getPoData(){
    const headers = {
      'Content-Type': 'text/plain',
    }
    axios.get(`http://localhost:5000/pos`, { headers })
    .then((resp) => {
      this.setState({
        po_list: resp.data
      })
      console.log(resp);
    }).catch(err => {
      console.error(err);
    })
  }

  submitPo(){
    const data = {
      vendor:this.state.vendor,
    }

    axios.post(
      `http://localhost:5000/pos`,
      data,
    )
    .then((resp) => {
      this.getPoData();
      console.log(resp);
    }).catch(err => {
      console.error(err);
    })
  }

  orderPo(id){
    axios.put(
      `http://localhost:5000/pos/${id}`
    )
    .then((resp) => {
      this.getPoData();
      console.log(resp);
    }).catch(err => {
      console.error(err);
    })
  }


  handleChange(event) {
      this.setState({vendor: event.target.value.toUpperCase()});
  }

  handleSubmit(event){
    this.submitPo();
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
              placeholder="Vendor"
              value={this.state.vendor}
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
        <th>PO #</th>
        <th>Vendor</th>
        <th>Ordered</th>
        <th>Date</th>
        </thead>
        <tbody>
        {
            this.state.po_list.map((po, index) => {
              return (
                <tr key={index} onClick={() => {}}>
                  <td className="col-sm-6 col-md-4 col-lg-3">
                    {po.id.toString().padStart(6, '0')}</td>
                  <td className="col-sm-6 col-md-4 col-lg-3">
                    {po.vendor}</td>
                  <td className="col-sm-6 col-md-4 col-lg-3">
                    {po.ordered
                      ? 'Order Placed'
                      : <button className="btn btn-primary" onClick={() => this.orderPo(po.id)}>Order</button>
                    }
                  </td>
                  <td className="col-sm-6 col-md-4 col-lg-3">
                    {po.orderDate ? po.orderDate.slice(0, 10) : ''}</td>
                    <td className="col-sm-6 col-md-4 col-lg-3">
                      <Link className="btn btn-primary" to={`/po/${po.id}`}>Open</Link></td>
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
