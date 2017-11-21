import React, {Component} from 'react';
import { Table, Pagination, Form, DatePicker, Button, Input, Modal, Spin } from 'antd';
import moment from 'moment';
import axios from 'axios';
import {baseUrl} from './Config';
import downloadJS from 'downloadjs';
import './index.css';

const _baseUrl = baseUrl;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const columns = [{
  title: 'Username',
  dataIndex: 'name',
}, {
  title: 'Submission Date',
  dataIndex: 'syncDate',
}, {
  title: 'Response Date',
  dataIndex: 'responseDate',
}, {
  title: 'Cooking benifits',
  dataIndex: 'q_cleanCookingBenefits'
}, {
  title: 'Status',
  dataIndex: 'status'
}];

export class SurveyTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible : false,
      subsDTStart: '2015-12-01',
      subsDTEnd: '2015-12-07',
      respDTStart: '2015-12-01',
      respDTEnd: '2015-12-07',
      username: '',
      loading: false,
      totalResponses: 0,
      currentPage: 1,
      data: [],
      selectedRows: [],
      surveyStatus: '',
      loadingApprove: false,
      loadingReject: false,
      loadingDownloadSelected: false,
      loadingDownloadAll: false,
      disableApprove: true,
      disableReject: true,
      disableDownloadSelected: true,
      disableDownloadAll: true

    };
    this.searchSubmission = this.searchSubmission.bind(this);
    this.showFilter = this.showFilter.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChangeStartSubsDate = this.handleChangeStartSubsDate.bind(this);
    this.handleChangeResponseDate = this.handleChangeResponseDate.bind(this);
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleApproveClick = this.handleApproveClick.bind(this);
    this.handleRejectClick = this.handleRejectClick.bind(this);
    this.setSurveyStatus = this.setSurveyStatus.bind(this);
    this.setLoadingStatus = this.setLoadingStatus.bind(this);
    this.handleDownloadSelectedClick = this.handleDownloadSelectedClick.bind(this);
    this.handleDownloadAllClick = this.handleDownloadAllClick.bind(this);
    this.download = this.download.bind(this);
  }

  searchSubmission = () => {
    let url = _baseUrl + '/survey/response';
    this.setState({
      loading: true
    });
    axios.get(url, {
      params: {
        subsDTStart: this.state.subsDTStart,
        subsDTEnd: this.state.subsDTEnd,
        respDTStart: this.state.respDTStart,
        respDTEnd: this.state.respDTEnd,
        username: this.state.username,
        page: this.state.currentPage
      }
    })
      .then( response => {
        this.handleCancel();
        this.setState({
          data: response.data.data.doc,
          totalResponses: response.data.data.total,
          currentPage: response.data.data.currentPage,
          loading: false
        });
        if (response.data.data.doc.length > 0) {
          this.setState({
            disableDownloadAll: false
          });
        } else {
          this.setState({
            disableDownloadAll: true
          });
        }
      });
  };
  setLoadingStatus = (status) => {
    if (status === 'APPROVED') {
      this.setState({
        loadingApprove: true,
        loadingReject: false
      });
    } else if (status === 'REJECTED') {
      this.setState({
        loadingApprove: false,
        loadingReject: true
      });
    } else {
      this.setState({
        loadingApprove: false,
        loadingReject: false
      });
    }
  };
  setSurveyStatus = () => {
    let url = _baseUrl + '/survey/status/' + this.state.surveyStatus;
    this.setLoadingStatus(this.state.surveyStatus);
    axios({
        method: 'post',
        url: url,
        data: this.state.selectedRows
      }
    )
      .then( response => {
        this.setState({
          surveyStatus: ''
        });
        this.setLoadingStatus('');
        this.searchSubmission();
      });
  };
  download = (url,params) => {
    axios(
      {
        url: url,
        method: 'get',
        responseType: 'blob',
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument'
          + '.spreadsheetml.sheet',
        },
        params: params
      }
    )
      .then(response => {
        downloadJS(response.data, 'nextbillion-' + new Date().getTime()+ '.xlsx');
      })
  };
  showFilter = () => {
    this.setState({
      visible: true
    });
  };
  handleDownloadSelectedClick = () => {
    let url = _baseUrl + '/survey/download/selected';
    let params = {
      selectedSurvey: this.state.selectedRows
    };
    this.download(url, params);
  };
  handleDownloadAllClick = () => {
    let url = _baseUrl + '/survey/download/all';
    let params = {
      subsDTStart: this.state.subsDTStart,
      subsDTEnd: this.state.subsDTEnd,
      respDTStart: this.state.respDTStart,
      respDTEnd: this.state.respDTEnd,
      username: this.state.username,
      page: this.state.currentPage
    };
    this.download(url, params);
  };
  handleApproveClick = () => {
    this.setState({
      surveyStatus: 'APPROVED'
    }, () => {
      this.setSurveyStatus()
    });
  };
  handleRejectClick = () => {
    this.setState({
      surveyStatus: 'REJECTED'
    }, () => {
      this.setSurveyStatus()
    });
  };
  handleCancel = (e) => {
    this.setState({
      visible: false
    });
  };
  handlePageChange = (page, pageSize) => {
    this.setState({
      currentPage: page
    });
  };
  handleChangeStartSubsDate = (data, dateString) => {
    this.setState({
      subsDTStart: dateString[0],
      subsDTEnd: dateString[1],
      respDTStart: null,
      respDTEnd: null,
      username: null
    });
  };
  handleChangeResponseDate = (data, dateString) => {
    this.setState({
      subsDTStart: null,
      subsDTEnd: null,
      respDTStart: dateString[0],
      respDTEnd: dateString[1],
      username: null
    });
  };
  handleChangeUsername = (e) => {
    this.setState({
      subsDTStart: null,
      subsDTEnd: null,
      respDTStart: null,
      respDTEnd: null,
      username: e.target.value
    });
  };
  componentDidUpdate(prevProps, prevState) {
    if (this.state.currentPage !== prevState.currentPage) {
      this.searchSubmission();
    }

  }
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
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRows: selectedRows.map(row => {
            return row._id;
          })
        });
        if (selectedRowKeys.length === 0){
          this.setState({
            disableApprove: true,
            disableReject: true,
            disableDownloadSelected: true
          });
        } else {
          this.setState({
            disableApprove: false,
            disableReject: false,
            disableDownloadSelected: false
          });
        }
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      }
    };
    return (
      <div>
        <div style={{"paddingBottom": "10px"}}>
          <span>
            <Button type="dashed" icon="filter" onClick={this.showFilter}>Filter</Button>
          </span>
          <span>
            <Button type="primary" icon="like-o" className="btnMargin"
                    onClick={this.handleApproveClick}
                    loading={this.state.loadingApprove}
                    disabled={this.state.disableApprove}
            >
              Approve
            </Button>
          </span>
          <span>
            <Button type="primary" icon="dislike-o" className="btnMargin"
                    onClick={this.handleRejectClick}
                    loading={this.state.loadingReject}
                    disabled={this.state.disableReject}
            >
              Reject
            </Button>
          </span>
          <span>
            <Button type="primary" icon="cloud-download-o" className="btnMargin"
                    onClick={this.handleDownloadSelectedClick}
                    loading={this.state.loadingDownloadSelected}
                    disabled={this.state.disableDownloadSelected}
            >
              Download selected
            </Button>
          </span>
          <span>
            <Button type="primary" icon="cloud-download" className="btnMargin"
                    onClick={this.handleDownloadAllClick}
                    loading={this.state.loadingDownloadAll}
                    disabled={this.state.disableDownloadAll}
            >
              Download all
            </Button>
          </span>
        </div>

        <Modal
          wrapClassName="filterForm"
          title="Filter survey responses by"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          width={650}
        >
          <Form>
            <FormItem {...formItemLayout} className="submissionDate" label="Submission Date">
              <RangePicker onChange={this.handleChangeStartSubsDate} defaultValue={[moment('2015-12-01'),moment('2015-12-07')]} />
              <Button type="dashed" icon="search" onClick={this.searchSubmission}>Search</Button>
            </FormItem>
            <FormItem {...formItemLayout} className="responseDate" label="Response Date">
              <RangePicker onChange={this.handleChangeResponseDate} defaultValue={[moment('2015-12-01'),moment('2015-12-07')]}/>
              <Button type="dashed" icon="search" onClick={this.searchSubmission}>Search</Button>
            </FormItem>
            <FormItem {...formItemLayout} className="username" label="Username">
              <Input placeholder="input search text" style={{width:275}} onChange={this.handleChangeUsername}/>
              <Button type="dashed" icon="search" onClick={this.searchSubmission}>Search</Button>
            </FormItem>
          </Form>
        </Modal>

        <Spin spinning={this.state.loading} >
          <Table rowSelection={rowSelection}
                 columns={columns}
                 dataSource={this.state.data}
                 pagination={false}
                 rowKey="_id"
          />

          <Pagination
            total={this.state.totalResponses}
            current={this.state.currentPage}
            pageSize={10}
            defaultCurrent={1}
            onChange={this.handlePageChange}
          />
        </Spin>
      </div>
    )
  }
}