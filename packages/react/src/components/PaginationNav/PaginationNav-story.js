/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, number, object } from '@storybook/addon-knobs';
import PaginationNav from '../PaginationNav';
import PaginationNavSkeleton from './PaginationNav.Skeleton';

const props = () => ({
  disabled: boolean('Disable backward/forward buttons (disabled)', false),
  onChange: action('onChange'),
  onClick: action('onClick'),
  page: number('The current page (page)', 1),
  pageSize: number('Number of items per page (pageSize)', 10),
  pagesToShow: number('Number of steps to show in the nav (pagesToShow)', 11),
  totalItems: number('Total number of pages (totalItems)', 103),
  translationIds: object(
    'PaginationNav translation IDs (for translateWithId callback)',
    {
      'next.page': 'Next page',
      page: 'Page',
      'previous.page': 'Previous page',
      'select.page.number': 'select page number',
    }
  ),
});

storiesOf('PaginationNav', module)
  .addDecorator(withKnobs)
  .add(
    'PaginationNav',
    () => {
      const { translationIds, ...paginationNavProps } = props();
      return (
        <>
          <PaginationNav
            translateWithId={id => translationIds[id]}
            {...paginationNavProps}
          />
          <PaginationNav
            translateWithId={id => translationIds[id]}
            {...paginationNavProps}
            pagesToShow={5}
          />
          <PaginationNav
            translateWithId={id => translationIds[id]}
            {...paginationNavProps}
            pagesToShow={2}
          />
        </>
      );
    },
    {
      info: {
        text: `
            The pagination component is used to switch through multiple pages of items, when only a maxium number of items can be displayed per page. Can be used in combination with other components like DataTable.
          `,
      },
    }
  )
  .add('skeleton', () => <PaginationNavSkeleton />, {
    info: {
      text: `
          The pagination component is used to switch through multiple pages of items, when only a maxium number of items can be displayed per page. Can be used in combination with other components like DataTable.
        `,
    },
  });
