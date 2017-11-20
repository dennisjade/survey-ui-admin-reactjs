import React, {Component} from 'react';
import {SurveyTable} from './Survey';
import {User} from './User';

class MyContent extends Component {
  render() {
    console.log('Here at Content:',this.props);
    switch (this.props.selectedKey){
      case 'survey':
        return (
         <SurveyTable/>
        );
      case 'userSettings':
        return (
          <User />
        );
      case 'importSettings':
        return (
          <p>Import Survey Questions</p>
        );
      case 'questionaireSettings':
        return (
          <p>Questionaire</p>
        );
      default:
        return (
          <p>Survey</p>
        );
    }
  }
}

export default MyContent