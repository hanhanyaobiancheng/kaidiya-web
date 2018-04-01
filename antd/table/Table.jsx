import React, {Component} from 'react';
import PropType from 'prop-types';
import {Table} from 'antd';
import {DragDropContext, DragSource, DropTarget} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import * as style from './style.less';


function dragDirection(
    dragIndex,
    hoverIndex,
    initialClientOffset,
    clientOffset,
    sourceClientOffset,
) {
    const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
    const hoverClientY = clientOffset.y - sourceClientOffset.y;
    if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
        return 'downward';
    }
    if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
        return 'upward';
    }
}

let BodyRow = (props) => {
    const {
        isOver,
        connectDragSource,
        connectDropTarget,
        moveRow,
        dragRow,
        clientOffset,
        sourceClientOffset,
        initialClientOffset,
        ...restProps
    } = props;
    const style = {...restProps.style, cursor: 'move'};

    let className = restProps.className;
    if (isOver && initialClientOffset) {
        const direction = this.dragDirection(
            dragRow.index,
            restProps.index,
            initialClientOffset,
            clientOffset,
            sourceClientOffset
        );
        if (direction === 'downward') {
            className += ' drop-over-downward';
        }
        if (direction === 'upward') {
            className += ' drop-over-upward';
        }
    }

    return connectDragSource(
        connectDropTarget(
            <tr
                {...restProps}
                className={className}
                style={style}
            />
        )
    );
};

class TableDrag extends Component {
    static defaultProps = {};

    static propTypes = {
        columns: PropType.array,
        dataSource: PropType.array,
        stopUpdateDataSource: PropType.func, // 停止更新dataSource
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

    rowSource = {
        beginDrag(props) {
            return {
                index: props.index,
            };
        },
    };

    rowTarget = {
        drop(props, monitor) {
            const dragIndex = monitor.getItem().index;
            const hoverIndex = props.index;

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }

            // Time to actually perform the action
            props.moveRow(dragIndex, hoverIndex);

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            monitor.getItem().index = hoverIndex;
        },
    };

    BodyRow = DropTarget('row', this.rowTarget, (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        sourceClientOffset: monitor.getSourceClientOffset(),
    }))(
        DragSource('row', this.rowSource, (connect, monitor) => ({
            connectDragSource: connect.dragSource(),
            dragRow: monitor.getItem(),
            clientOffset: monitor.getClientOffset(),
            initialClientOffset: monitor.getInitialClientOffset(),
        }))(BodyRow)
    );

    render() {
        const {
            columns,
            onRow,
            components,
        } = this.props;

        const {
            dataSource,
        } = this.state;

        return (
            <div className="wrap">
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    components={components}
                    onRow={onRow}
                />
            </div>
        );
    }
}

const TablePro = DragDropContext(HTML5Backend)(TableDrag);

export default TablePro;
