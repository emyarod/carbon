/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { settings } from 'carbon-components';
import {
  CaretLeftGlyph,
  CaretRightGlyph,
  OverflowMenuHorizontal16,
} from '@carbon/icons-react';
import setupGetInstanceId from '../../tools/setupGetInstanceId';
import SelectItem from '../SelectItem';

const { prefix } = settings;
const getInstanceId = setupGetInstanceId();
const translationIds = {
  'next.page': 'next.page',
  page: 'page',
  'previous.page': 'previous.page',
  'select.page.number': 'select.page.number',
};
const defaultTranslations = {
  [translationIds['next.page']]: 'Next page',
  [translationIds['page']]: 'Page',
  [translationIds['previous.page']]: 'Previous page',
  [translationIds['select.page.number']]: 'select page number',
};
export const PaginationNavListItem = ({ children }) => (
  <li className={`${prefix}--pagination-nav__list-item`}>{children}</li>
);
const PaginationNavDirectionalButton = ({
  children,
  disabled,
  onClick: handleClick,
}) => {
  const paginationNavDirectionalButtonClasses = classnames(
    `${prefix}--pagination-nav__page`,
    `${prefix}--pagination-nav__page--direction`,
    {
      [`${prefix}--pagination-nav__page--disabled`]: disabled,
    }
  );
  return (
    <button
      className={paginationNavDirectionalButtonClasses}
      disabled={disabled || null}
      aria-disabled={disabled || null}
      onClick={handleClick}>
      {children}
    </button>
  );
};
const PaginationNavA11yLabel = ({ children }) => (
  <span className={`${prefix}--pagination-nav__accessibility-label`}>
    {children}
  </span>
);
export const PaginationNavStep = ({
  active,
  disabled,
  onClick: handleClick,
  pageNumber,
  translateWithId: t,
}) => {
  const paginationNavListItemButtonClasses = classnames(
    `${prefix}--pagination-nav__page`,
    {
      [`${prefix}--pagination-nav__page--active`]: active,
      [`${prefix}--pagination-nav__page--disabled`]: disabled,
    }
  );
  return (
    <button
      className={paginationNavListItemButtonClasses}
      aria-current={active ? 'page' : null}
      aria-disabled={disabled || null}
      onClick={handleClick}>
      <PaginationNavA11yLabel>{t('page')}</PaginationNavA11yLabel>
      {pageNumber}
    </button>
  );
};
const PaginationNavSelect = ({
  active,
  children,
  currentPage,
  disabled,
  handleBlur,
  handleChange,
  handleSelect,
  translateWithId: t,
}) => {
  const selectClasses = classnames(
    `${prefix}--pagination-nav__page`,
    `${prefix}--pagination-nav__page--select`,
    {
      [`${prefix}--pagination-nav__page--active`]: active,
    }
  );
  return (
    <div className={`${prefix}--pagination-nav__select`}>
      <select
        aria-label={t('select.page.number')}
        className={selectClasses}
        disabled={disabled}
        onBlur={evt => handleBlur && handleBlur(evt)}
        onChange={evt => {
          if (handleChange) {
            handleChange(evt);
          }
          handleSelect(evt, { pageNumber: Number(evt.target.value) });
        }}
        value={active && currentPage}>
        <SelectItem value="" hidden />
        {children}
      </select>
      <div className={`${prefix}--pagination-nav__select-icon-wrapper`}>
        <OverflowMenuHorizontal16
          className={`${prefix}--pagination-nav__select-icon`}
        />
      </div>
    </div>
  );
};
export const PaginationNavPages = ({
  currentPage,
  disabled,
  handleChange,
  handleNavStepClick,
  handleSelect,
  pagesToShow,
  pageTotal,
  translateWithId: t,
}) => {
  if (pagesToShow < pageTotal) {
    const visibleSteps = pagesToShow === 2 ? 1 : pagesToShow - 3; // beginning, end, overflow
    const overflowThreshold = pagesToShow - visibleSteps;
    const visiblePages = [];
    const selectItems = [];
    const lastPage = [];
    for (let pageNumber = 1; pageNumber <= pageTotal; pageNumber++) {
      const visiblePage = (
        <PaginationNavListItem key={pageNumber}>
          <PaginationNavStep
            active={!disabled && pageNumber === currentPage}
            disabled={disabled || pageNumber === currentPage}
            onClick={evt => handleNavStepClick(evt, { pageNumber })}
            pageNumber={pageNumber}
            translateWithId={t}
          />
        </PaginationNavListItem>
      );
      if (pageNumber <= overflowThreshold) {
        visiblePages.push(visiblePage);
      } else if (pageNumber === pageTotal && pagesToShow !== 2) {
        // last page (if outside select)
        lastPage.push(visiblePage);
      } else {
        selectItems.push(
          <SelectItem
            key={pageNumber}
            value={pageNumber}
            text={`${pageNumber}`}
          />
        );
      }
    }
    return [
      ...visiblePages,
      <PaginationNavListItem key="select">
        <PaginationNavSelect
          active={
            pagesToShow === 2
              ? currentPage > overflowThreshold
              : currentPage > overflowThreshold && currentPage !== pageTotal
          }
          currentPage={currentPage}
          disabled={disabled}
          handleChange={handleChange}
          handleSelect={handleSelect}
          translateWithId={t}>
          {selectItems}
        </PaginationNavSelect>
      </PaginationNavListItem>,
      ...lastPage,
    ];
  }
  return [...Array(pageTotal)].map((_, i) => {
    const pageNumber = i + 1;
    return (
      <PaginationNavListItem key={pageNumber}>
        <PaginationNavStep
          active={!disabled && pageNumber === currentPage}
          disabled={disabled || pageNumber === currentPage}
          onClick={evt => handleNavStepClick(evt, { pageNumber })}
          pageNumber={pageNumber}
          translateWithId={t}
        />
      </PaginationNavListItem>
    );
  });
};

export default function PaginationNav(props) {
  const uniqueId = useMemo(getInstanceId, []);
  const [currentPage, setCurrentPage] = useState(1);
  const {
    className,
    disabled,
    id = typeof id !== 'undefined' ? id : uniqueId,
    onChange,
    onDirectionalButtonClick,
    onNavStepClick,
    pageSize,
    pagesToShow,
    totalItems,
    translateWithId: t,
    ...rest
  } = props;
  const paginationNavClasses = classnames(
    `${prefix}--pagination-nav`,
    className
  );
  const handleNavStepClick = (evt, { pageNumber }) => {
    onNavStepClick && onNavStepClick(evt);
    setCurrentPage(pageNumber);
  };
  const handleDirectionalButtonClick = (evt, { action }) => {
    onDirectionalButtonClick && onDirectionalButtonClick(evt);
    switch (action) {
      case 'INCREMENT_PAGE':
        setCurrentPage(Number(currentPage) + 1);
        break;
      case 'DECREMENT_PAGE':
        setCurrentPage(Number(currentPage) - 1);
        break;
      default:
        break;
    }
  };
  const handleSelect = (evt, { pageNumber }) => {
    setCurrentPage(pageNumber);
  };
  const pageTotal = Math.max(Math.ceil(totalItems / pageSize), 1);
  return (
    <nav {...rest} id={id} className={paginationNavClasses}>
      <ul className={`${prefix}--pagination-nav__list`}>
        <PaginationNavListItem>
          <PaginationNavDirectionalButton
            disabled={disabled || currentPage === 1}
            onClick={evt =>
              handleDirectionalButtonClick(evt, { action: 'DECREMENT_PAGE' })
            }>
            <PaginationNavA11yLabel>
              {t('previous.page')}
            </PaginationNavA11yLabel>
            <CaretLeftGlyph className={`${prefix}--pagination-nav__icon`} />
          </PaginationNavDirectionalButton>
        </PaginationNavListItem>
        <PaginationNavPages
          currentPage={currentPage}
          disabled={disabled}
          handleChange={onChange}
          handleNavStepClick={handleNavStepClick}
          handleSelect={handleSelect}
          pageTotal={pageTotal}
          pagesToShow={pagesToShow}
          translateWithId={t}
        />
        <PaginationNavListItem>
          <PaginationNavDirectionalButton
            disabled={disabled || currentPage === pageTotal}
            onClick={evt =>
              handleDirectionalButtonClick(evt, { action: 'INCREMENT_PAGE' })
            }>
            <PaginationNavA11yLabel>{t('next.page')}</PaginationNavA11yLabel>
            <CaretRightGlyph className={`${prefix}--pagination-nav__icon`} />
          </PaginationNavDirectionalButton>
        </PaginationNavListItem>
      </ul>
    </nav>
  );
}

PaginationNav.propTypes = {
  /**
   * The CSS class
   */
  className: PropTypes.string,

  /**
   * Specify whether or not the component should be disabled
   */
  disabled: PropTypes.bool,

  /**
   * The unique ID of this component instance
   */
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * The `change` event handler
   */
  onChange: PropTypes.func,

  /**
   * The event handler for a click on a directional nav button
   */
  onDirectionalButtonClick: PropTypes.func,

  /**
   * The event handler for a click on a nav step
   */
  onNavStepClick: PropTypes.func,

  /**
   * The number of items a page contains
   */
  pageSize: PropTypes.number,

  /**
   * The number of pages/steps to show in the nav. Extra pages will be placed
   * in a <select> menu
   */
  pagesToShow: PropTypes.number,

  /**
   * The total number of items
   */
  totalItems: PropTypes.number,

  /**
   * i18n hook used to provide the appropriate description for the given menu
   * icon. This function takes in an id defined in `translationIds` and should
   * return a string message for that given message id.
   */
  translateWithId: PropTypes.func.isRequired,
};

PaginationNav.defaultProps = {
  'aria-label': 'pagination',
  pageSize: 10,
  pagesToShow: 2,
  translateWithId: id => defaultTranslations[id],
};
