import React, { Component } from 'react';
import { Card, Typography, Image, Space, Rate } from 'antd';
import { format } from 'date-fns';

import { Consumer } from '../../services/context/context.jsx';
import './Card.css';

const MAX_OVERVIEW_LENGTH = 180;
const MAX_TITLE_LENGTH = 13;
const NO_RELEASE_DATE = 'Unknow realease date';
const NO_OVERVIEW_TEXT = 'No description';
const NO_IMAGE_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg==';

export default class CardItem extends Component {
  state = {};
  keyIterator = 10000000;

  handleRateChange = (value) => {
    const { handleRateChange, movieId } = this.props;
    handleRateChange(value, movieId);
  };

  showRating = (vote_average) => {
    const voteAverage = vote_average.toFixed(1);
    let className;
    if (voteAverage < 3) {
      className = 'lessThree';
    } else if (voteAverage < 5) {
      className = 'lessFive';
    } else if (voteAverage < 7) {
      className = 'lessSeven';
    } else {
      className = 'moreSeven';
    }
    this.setState({ voteAvrgClassName: className, voteAvrg: voteAverage });
  };

  componentDidMount() {
    const { vote_average } = this.props.searchResult;
    this.showRating(vote_average);
  }

  render() {
    const { Title, Text, Link } = Typography;
    const { searchResult, baseImgUrl } = this.props;
    const { original_title, overview, poster_path, release_date, id, genre_ids, rating } = searchResult;
    const { voteAvrgClassName, voteAvrg } = this.state;
    const fixedDate = Date.parse(release_date);
    const date = release_date ? format(new Date(fixedDate), 'MMMM d, yyyy') : NO_RELEASE_DATE;
    const showGenre = (genreList, genre_ids) => {
      let fixedList = [];
      genreList.forEach((item) => {
        genre_ids.forEach((elem) => {
          if (item.id === elem) {
            fixedList.push(item);
          }
        });
      });
      return fixedList;
    };

    return (
      <Consumer>
        {({ state: { genreList, guestId }, handleRateChange }) => {
          return (
            <Card
              className="card"
              hoverable
              style={{
                width: 470,
                height: 260,
              }}
            >
              <Space className="space">
                <PostImage poster_path={poster_path} baseImgUrl={baseImgUrl} />
                <div className="content">
                  <div className="title-vote">
                    <Title className="title" level={4}>
                      {original_title}
                    </Title>
                    <p className={`popularity ${voteAvrgClassName}`}>{voteAvrg}</p>
                  </div>

                  <Text className="secondary" type="secondary">
                    {date}
                  </Text>
                  <ul className="genreList">
                    {showGenre(genreList, genre_ids).map((item) => {
                      return (
                        <Text code key={this.keyIterator++}>
                          <Link href="#" className="link">
                            {item.name || 'Unknow'}
                          </Link>
                        </Text>
                      );
                    })}
                  </ul>
                  <Text className="text">
                    {overview ? splicedOverview(overview, original_title) : NO_OVERVIEW_TEXT}
                  </Text>
                  <div className="rate">
                    <Rate
                      allowHalf
                      defaultValue={rating}
                      count={10}
                      onChange={(value) => handleRateChange(guestId, value, id)}
                    />
                  </div>
                </div>
              </Space>
            </Card>
          );
        }}
      </Consumer>
    );
  }
}

const PostImage = (prop) => {
  const { poster_path, baseImgUrl } = prop;
  if (!poster_path) {
    return <Image fallback={NO_IMAGE_URL} src="error" width={170} />;
  }
  return <Image src={`${baseImgUrl}${poster_path}`} width={170} />;
};

const splicedOverview = (text, title) => {
  let shortenText;
  if (text.length > MAX_OVERVIEW_LENGTH) {
    shortenText = text.slice(0, MAX_OVERVIEW_LENGTH).split(' ');
  }
  if (title.length > MAX_TITLE_LENGTH) {
    shortenText = text.slice(0, 50).split(' ');
  }
  return shortenText ? `${shortenText.join(' ')}...` : text;
};
