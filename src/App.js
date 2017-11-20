import React, {Component} from 'react';
import 'antd/dist/antd.css';
import { Menu, Icon, Layout } from 'antd';
import MyContent from './Content';
const SubMenu = Menu.SubMenu;
const { Header, Content, Footer } = Layout;

export class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMenu: 'survey',
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick = (e) => {
    this.setState({
      selectedMenu: e.key,
    });
  }
  render() {
    return (
      <Layout className="layout">
        <Header>
          <Menu
            theme="dark"
            onClick={this.handleClick}
            selectedKeys={[this.state.selectedMenu]}
            mode="horizontal"
          >
            <Menu.Item key="survey">
              <Icon type="mail" />Survey
            </Menu.Item>
            <SubMenu title={<span><Icon type="setting" />Tools</span>}>
              <Menu.Item icon="team" key="userSettings">User Management</Menu.Item>
              <Menu.Item key="importSettings">Import Survey Questions</Menu.Item>
              <Menu.Item key="questionaireSettings">Questionaire</Menu.Item>
            </SubMenu>
            <Menu.Item key="Graphs">
              <a href="http://ec2-34-235-89-110.compute-1.amazonaws.com" target="_blank" rel="noopener noreferrer">
                Graphs
              </a>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ margin: '10px 16px', padding: 24, background: '#fff', minHeight: 520 }}>
          <MyContent selectedKey={this.state.selectedMenu} />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          NextBillion Asia @ 2017</Footer>
      </Layout>
    );
  }
}
