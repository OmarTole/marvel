import { Component } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import Skeleton from '../skeleton/Skeleton'

import './charInfo.scss';

class CharInfo extends Component {

    state = {
        char: null,
        loading: false,
        error: false,
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChart();
    }

    componentDidUpdate(prevProps) {
        if(this.props.charId !== prevProps.charId) {
            this.updateChart();
        }
    }

    updateChart = () => {
        const {charId} = this.props;
        if(!charId) {
            return;
        }

        this.onChatLoading();

        this.marvelService
            .getCharacter(charId)
            .then(this.onChatLoaded)
            .catch(this.onError);
    }

    onChatLoaded = (char) => {
        this.setState({
                        char,
                        loading: false
                    })
    }

    onChatLoading = () => {
        this.setState({
            loading: true
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true,
        })
    }



    render () {
        const {char, loading, error} = this.state;
        const errorMessage = error ? <ErrorMessage/> : null,
              spinner = loading ? <Spinner/> : null,
              content = !(error || spinner || !char) ? <View char={char}/> : null,
              skeleton = loading || error || char ? null : <Skeleton/>;

        return (
            <div className="char__info">
                {errorMessage}
                {spinner}
                {content}
                {skeleton}
            </div>
        )
    }
}

const View = ({char}) => {
    const {name, thumbnail, description, wiki, homepage, comics} = char;
    let imgStyle = {'objectFit' : 'cover'};
    if (char.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'};
    }

        return(
            <>
                <div className="char__basics">
                    <img src={thumbnail} alt={name} style={imgStyle}/>
                    <div>
                        <div className="char__info-name">{name}</div>
                        <div className="char__btns">
                            <a href={homepage} className="button button__main">
                                <div className="inner">homepage</div>
                            </a>
                            <a href={wiki} className="button button__secondary">
                                <div className="inner">Wiki</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="char__descr">
                   {description} 
                </div>
                <div className="char__comics">Comics:</div>
                <ul className="char__comics-list">
                    {comics.length > 0 ? null : "There is no comics with this character"}
                    {
                        comics.map((item, i) => {
                            // eslint-disable-next-line
                            if (i > 9) return;
                            return (
                                <li className="char__comics-item" key={i}>
                                    {item.name}
                                </li>
                            )
                        })
                    }
                </ul>
            </>
        )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;