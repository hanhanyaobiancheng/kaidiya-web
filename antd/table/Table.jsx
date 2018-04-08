import React, {Component} from 'react';
import PropType from 'prop-types';
import {Table} from 'antd';

export default class TablePro extends Component {
    static defaultProps = {};

    static propTypes = {
        columns: PropType.array,
        dataSource: PropType.array,
        stopUpdateDataSource: PropType.func, // 停止更新dataSource
        onRowClick: PropType.func, // 行的点击事件
        updateDataSource: PropType.bool, // 是否更新dataSource
    };

    state = {};

    componentWillReceiveProps({
        dataSource,
        updateDataSource,
                              }) {
        if (dataSource && updateDataSource) {
            this.setState({dataSource});
            this.props.stopUpdateDataSource();
        }
    }


    render() {
        const {
            columns,
            components,
            dataSource,
        } = this.props;

        return (
            <div className="wrap">
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    components={components}
                    onRow={(record, index) => {
                        return {
                            onClick: () => {
                                this.props.onRowClick(record, index);
                            },
                        };
                    }}
                />
            </div>
        );
    }
}
