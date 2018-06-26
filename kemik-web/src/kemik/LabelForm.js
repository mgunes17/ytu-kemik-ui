import React, { Component } from 'react';


class LabelForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            projectName: 'havadis',
            tweetCount: 1,
            labelStatus: false,
            tweetContent: '',
            tweetId: '',
            usernameStatus: true,
            candidataTweet: {},
            labeledCount: 0
        }

        this.backendHost = "https://kalem.app:9998"
    }

    componentDidMount() {
        
    }

    getUserLabelCount = () => {
        fetch(this.backendHost+'/data/')
    }

    getNewTweet = () => {

        fetch(this.backendHost+'/data/tweets/simple-data', {
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
            if (data && Array.isArray(data)) {

                var tweetContent = data[0].content;
                // remove urls
                tweetContent = tweetContent.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');

                this.setState({
                    tweetContent: tweetContent,
                    tweetId: data[0].simpleDataId
                })
            } else {
                alert("veri yok")
            }
        }).catch(err => {
            alert("Bir hata oldu.")
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

    handleLabelButtonClick = (event) => {
        event.preventDefault();
        var labelType = event.currentTarget.value;
        fetch(this.backendHost+'/data/tweets/label-informations', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'labeledTweetDTOList': [
                    {
                        'labelType': labelType,
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

        this.getNewTweet();
    }

    render() {
        return (
            <div>
                <p>Kullanıcı: {this.state.username} </p>
                <p>Etiketleme sayısı: {this.state.labeledCount} </p>

                {this.state.usernameStatus &&
                    <form onSubmit={this.handleCandidateSubmit}>
                        <label>Kullanıcı Adı:</label>
                        <input  type="text"
                                name="username"
                                onChange={this.handleUsernameChange} />
                        <input type="submit" value="Submit" />
                    </form>
                }

                {this.state.labelStatus === true &&
                    <div>
                        <p>{this.state.tweetContent}</p>
                        <div>
                            <div>
                                <button className="btn btn-lg" value="POSITIVE" onClick={this.handleLabelButtonClick}><i className="far fa-2x fa-smile"></i></button>
                                <button className="btn btn-lg" value="NOTR" onClick={this.handleLabelButtonClick}><i className="far fa-2x fa-meh"></i></button>
                                <button className="btn btn-lg" value="NEGATIVE" onClick={this.handleLabelButtonClick}><i className="far fa-2x fa-angry"></i></button>
                            </div>
                            <div>
                                <button className="btn btn-lg" value="FREE" onClick={this.handleLabelButtonClick}><i className="fas fa-2x fa-question"></i></button>
                                <button className="btn btn-lg" value="BOT" onClick={this.handleLabelButtonClick}><i className="fas fa-2x fa-robot"></i></button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default LabelForm;