import UilellipsisH from '@iconscout/react-unicons/icons/uil-ellipsis-h';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { CardFrame } from './style';
import { Dropdown } from '../../dropdown/dropdown';
import Heading from '../../heading/heading';

function Cards(props) {
  const {
    title,
    children,
    more, // This prop holds the dropdown content
    moreText,
    size,
    headless,
    caption,
    isbutton,
    bodyStyle,
    headStyle,
    border,
    bodypadding,
    className,
  } = props;
  return (
    <>
      {!headless ? (
        // Existing logic for when headless is false (card has a header)
        <CardFrame
          size={size}
          title={title}
          bodyStyle={bodyStyle && bodyStyle}
          headStyle={headStyle && headStyle}
          bordered={border}
          className={className}
          bodypadding={bodypadding && bodypadding}
          extra={
            <>
              {more && ( // Render dropdown if 'more' content is provided
                <Dropdown content={more} placement="bottom">
                  <Link onClick={(e) => e.preventDefault()} to="#">
                    {!moreText ? <UilellipsisH /> : 'More'}
                  </Link>
                </Dropdown>
              )}

              {isbutton && isbutton}
            </>
          }
          style={{ width: '100%' }}
        >
          {children}
        </CardFrame>
      ) : (
        // Modified logic for when headless is true (card has no explicit header)
        <CardFrame
          bodypadding={bodypadding && bodypadding}
          bodyStyle={bodyStyle && bodyStyle}
          size={size}
          style={{ width: '100%' }}
          bordered={border}
          className={className}
        >
          {/* Flex container for title/caption and the 'more' dropdown */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: title || caption ? '10px' : '0',
            }}
          >
            <div>
              {title && <Heading as="h4">{title}</Heading>}
              {caption && <p>{caption}</p>}
            </div>
            {more && ( // Render dropdown if 'more' content is provided, even when headless
              <Dropdown content={more} placement="bottom">
                <Link onClick={(e) => e.preventDefault()} to="#">
                  {!moreText ? <UilellipsisH /> : 'More'}
                </Link>
              </Dropdown>
            )}
          </div>
          {children}
        </CardFrame>
      )}
    </>
  );
}

Cards.defaultProps = {
  border: false,
};

Cards.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.node]),
  size: PropTypes.string,
  more: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.node]), // Ensure 'more' is in propTypes
  bodyStyle: PropTypes.object,
  headStyle: PropTypes.object,
  isbutton: PropTypes.node,
  headless: PropTypes.bool,
  border: PropTypes.bool,
  caption: PropTypes.string,
  bodypadding: PropTypes.string,
  className: PropTypes.string,
  moreText: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.node]),
};

export { Cards };
