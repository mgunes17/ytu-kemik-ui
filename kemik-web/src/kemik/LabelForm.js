import React, { Component } from 'react';

class LabelForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            projectName: 'havadis',
            tweetCount: 1,
            labelTypeList: [],
            labelStatus: false,
            tweetContent: '',
            selectedLabel: '',
            tweetId: '',
            usernameStatus: true,
            candidataTweet: {},
            labeledCount: 0
        }
    }

    componentDidMount() {
        this.getLabelTypes();
    }

    getLabelTypes = () => {
        fetch('http://localhost:9999/data/data/labels?labelCode=havadis')
            .then(response => {
                return response.json();
            })
            .then(data => {
                this.setState({
                    labelTypeList: data
                })
            })
    }

    getNewTweet = () => {

        fetch('http://localhost:9999/data/tweets/simple-data', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'projectName': 'havadis',
                'username': this.state.username,
                'tweetCount': 1
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            if (data) {
                this.setState({
                    tweetContent: data[0].content,
                    tweetId: data[0].simpleDataId
                })
            } else {
                alert("veri yok")
            }

        })

        this.setState({
            selectedLabel: 'POSITIVE'
        })

    }

    handleCandidateSubmit = (event) => {
        event.preventDefault();

        if (this.state.username === null || this.state.username === '') {
            alert("lütfen kullanıcı adı girin")
        } else {
            this.setState({
                labelStatus: true,
                usernameStatus: false
            });

            this.getNewTweet();
        }
    }

    handleUsernameChange = (event) => {
        event.preventDefault();
        this.setState({ username: event.target.value })
    }

    handleLabelChange = (event) => {
        event.preventDefault();
        this.setState({ selectedLabel: event.target.value })
    }

    handleLabelSubmit = (event) => {
        event.preventDefault();
        fetch('http://localhost:9999/data/tweets/label-informations', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'labeledTweetDTOList': [
                    {
                        'labelType': this.state.selectedLabel,
                        'simpleDataId': this.state.tweetId
                    }
                ],
                'username': this.state.username
            })
        }).then(response => {
            if (response.ok) {
                let labeledCount = this.state.labeledCount;
                this.setState({ labeledCount: labeledCount + 1 })
            } else {
                alert("başarısız");

            }
        })

        this.myFormRef.reset();
        this.getNewTweet();
    }

    render() {
        return (
            <div>
                <p>Kullanıcı: {this.state.username} </p>
                <p>Etiketleme sayısı: {this.state.labeledCount} </p>

                {this.state.usernameStatus &&
                    <form onSubmit={this.handleCandidateSubmit}>
                        <label>
                            Kullanıcı Adı:<br />
                            <input
                                type="text"
                                name="username"
                                onChange={this.handleUsernameChange} /> <br />
                        </label>
                        <input type="submit" value="Submit" /><br />
                    </form>
                }

                {this.state.labelStatus === true &&
                    <div>
                        <p>{this.state.tweetContent}</p>
                        <form onSubmit={this.handleLabelSubmit} ref={(el) => this.myFormRef = el}>
                            <label>
                                Etiket:<br />
                                <select name="labelSelect" onChange={this.handleLabelChange}>
                                    {this.state.labelTypeList.map(labelType => <option key={labelType} value={labelType}>{labelType}</option>)}
                                </select> <br />
                            </label>
                            <input type="submit" value="Submit" /><br />
                        </form>
                    </div>
                }
            </div>
        );
    }
}

export default LabelForm;