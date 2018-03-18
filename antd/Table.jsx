import React, {Component} from 'react';
import PropType from 'prop-types';
import {Table} from 'antd';

export class TablePro extends Component {
    static defaultProps = {};

    static propTypes = {
        columns: PropType.array,
    };

    state = {};

    render() {
        const {
            columns,
        } = this.props;
        return (
            <Table
                columns={columns}
            />
        );
    }
}