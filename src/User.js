import React, { Component } from 'react';
import { Table, Input, Popconfirm, Form, Button, Modal, message, Spin } from 'antd';
import axios from 'axios';
import {baseUrl} from './Config';

const _baseUrl = baseUrl;
const FormItem = Form.Item;
const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
);

export class User extends Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: 'Name',
      dataIndex: 'name',
      width: '25%',
      render: (text, record) => this.renderColumns(text, record, 'name'),
    },{
      title: 'Location',
      dataIndex: 'location',
      width: '15%',
      render: (text, record) => this.renderColumns(text, record, 'location'),
    }, {
      title: 'Username',
      dataIndex: 'username',
      width: '15%',
      render: (text, record) => this.renderColumns(text, record, 'username'),
    }, {
      title: 'Password',
      dataIndex: 'password',
      width: '15%',
      render: (text, record) => this.renderColumns(text, record, 'password'),
    }, {
      title: 'Action',
      dataIndex: 'action',
      render: (text, record) => {
        const { editable } = record;
        return (
          <div className="editable-row-operations">
            {
              editable ?
                  <span>
                    <a onClick={() => this.save(record.key)} style={{marginRight:"10px"}}>Save</a>
                    <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                      <a>Cancel</a>
                    </Popconfirm>
                  </span>
                :
                  <div>
                    <span>
                      <a onClick={() => this.edit(record.key)}>Edit</a>
                    </span>
                    <span style={{marginLeft:"10px"}}>
                      <Popconfirm title="Sure to delete?" onConfirm={() => this.delete(record.key)}>
                        <a href="#">Delete</a>
                      </Popconfirm>
                    </span>
                  </div>
            }

          </div>
        );
      },
    }];
    this.state = {
      data: [],
      isAddUserFormVisible: false,
      spinnerVisible: false,
      name: '',
      location: '',
      username: '',
      password: ''
    };
    this.handleUserAdd = this.handleUserAdd.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.showAddUserForm = this.showAddUserForm.bind(this);
    this.hideUserAddForm = this.hideUserAddForm.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeLocation = this.handleChangeLocation.bind(this);
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.addUser = this.addUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.reloadUserList = this.reloadUserList.bind(this);
    this.edit = this.edit.bind(this);
    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
    this.delete = this.delete.bind(this);
  }
  componentDidMount() {
    this.reloadUserList();
  };
  componentDidUpdate() {
    // this.cacheData = this.state.data;
  }
  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
      />
    );
  }
  handleChangeName = (e) => {
    this.setState({
      name: e.target.value
    });
  };
  handleChangeLocation = (e) => {
    this.setState({
      location: e.target.value
    });
  };
  handleChangeUsername = (e) => {
    this.setState({
      username: e.target.value
    })
  };
  handleChangePassword = (e) => {
    this.setState({
      password: e.target.value
    })
  };
  handleUserAdd = () => {

  };
  handleChange(value, key, column) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target[column] = value;
      this.setState({ data: newData });
    }
  }
  showAddUserForm = () => {
    this.setState({
      isAddUserFormVisible: true
    })
  };
  hideUserAddForm = () => {
    this.setState({
      isAddUserFormVisible: false
    })
  };
  reloadUserList = () => {
    let url = _baseUrl + '/user';
    axios({
        method: 'get',
        url: url
      }
    )
      .then( response => {
        this.setState({
          data: response.data.data
        })
      });
  };
  addUser = () => {
    let url = _baseUrl + '/user';
    axios({
        method: 'post',
        url: url,
        data: {
          name: this.state.name,
          location: this.state.location,
          username: this.state.username,
          password: this.state.password
        }
      }
    )
      .then( response => {
        this.reloadUserList();
      });
  };
  updateUser = (key, userData, newData) =>{
    let url = _baseUrl + '/user?key=' + key;
    axios({
        method: 'put',
        url: url,
        data: userData
      }
    )
      .then( response => {
        console.log('Done updating', userData.username)
        this.setState({ data: newData });
      })
      .catch( err => {
        message.error('Duplicate username. Should be unique.')
        this.reloadUserList();
      })
  };
  edit(key) {
    // let _data = this.state.data;
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target.editable = true;
      this.setState({ data: newData });
      // this.setState({ cacheData: _data})
    }
  }
  save(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      delete target.editable;
      // this.setState({ data: newData });
      this.updateUser(key, target, newData);
      // this.cacheData = newData.map(item => ({ ...item }));
    }
  }
  cancel(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      // Object.assign(target, this.state.cacheData.filter(item => key === item.key)[0]);
      delete target.editable;
      this.setState({ data: newData });
      this.reloadUserList();
    }
  }
  delete = (key) => {
    let url = _baseUrl + '/user?key=' + key;
    axios({
        method: 'delete',
        url: url
      }
    )
      .then( response => {
        this.reloadUserList();
      });
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 4 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };
    return (
      <div>
        <Modal
          wrapClassName="addUserForm"
          title="Fill in the form to add user"
          visible={this.state.isAddUserFormVisible}
          onCancel={this.hideUserAddForm}
          width={650}
        >
          <Spin spinning={this.state.spinnerVisible}>
            <Form>
              <FormItem {...formItemLayout} label="Name">
                <Input placeholder="input complete name" style={{width:275}} onChange={this.handleChangeName}/>
              </FormItem>
              <FormItem {...formItemLayout} label="Location">
                <Input placeholder="input location" style={{width:275}} onChange={this.handleChangeLocation}/>
              </FormItem>
              <FormItem {...formItemLayout} label="Username" >
                <Input placeholder="input unique username" style={{width:275}} onChange={this.handleChangeUsername}/>
              </FormItem>
              <FormItem {...formItemLayout} label="Password" >
                <Input placeholder="input password" style={{width:275}} onChange={this.handleChangePassword}/>
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                <Button type="dash" icon="search" onClick={this.addUser}>Add user</Button>
              </FormItem>
            </Form>
          </Spin>
        </Modal>
        <Form>
          <FormItem>
            <Button type="dashed" icon="team" onClick={this.showAddUserForm}>Add user</Button>
          </FormItem>
        </Form>
        <Table bordered dataSource={this.state.data} columns={this.columns} rowKey="_id"/>
      </div>
    )
  }
}
