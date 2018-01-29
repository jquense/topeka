import merge from 'lodash/merge'
import React from 'react'
import Label from 'react-bootstrap/lib/Label'
import Table from 'react-bootstrap/lib/Table'

let cleanDocletValue = str =>
  str
    .trim()
    .replace(/^\{/, '')
    .replace(/\}$/, '')

function getPropsData(componentData, metadata) {
  let props = componentData.props || {}

  if (componentData.composes) {
    componentData.composes.forEach(other => {
      props = merge({}, getPropsData(metadata[other] || {}, metadata), props)
    })
  }

  if (componentData.mixins) {
    componentData.mixins.forEach(other => {
      if (componentData.composes.indexOf(other) === -1) {
        props = merge({}, getPropsData(metadata[other] || {}, metadata), props)
      }
    })
  }

  return props
}

class PropTable extends React.Component {
  componentWillMount() {
    let componentData = this.props.metadata[this.props.component] || {}
    this.propsData = getPropsData(componentData, this.props.metadata)
  }

  render() {
    let propsData = this.propsData
    let composes = this.props.metadata[this.props.component].composes || []

    if (!Object.keys(propsData).length) {
      return <span />
    }

    return (
      <div>
        <h3>
          <code>{this.props.component}</code> props
          {!!composes.length && [
            <br />,
            <small>
              {'Also accepts the same props as: '}
              <em>
                {composes.reduce(
                  (arr, name) => arr.concat(<code>{`<${name}/>`}</code>, ' '),
                  []
                )}
              </em>
            </small>,
          ]}
        </h3>

        <Table bordered striped className="prop-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>{this.renderRows(propsData)}</tbody>
        </Table>
      </div>
    )
  }

  renderRows(propsData) {
    return Object.keys(propsData)
      .sort()
      .filter(
        propName =>
          propsData[propName].type && !propsData[propName].doclets.private
      )
      .map(propName => {
        let propData = propsData[propName]

        return (
          <tr key={propName} className="prop-table-row">
            <td>
              {propName} {this.renderRequiredLabel(propData)}
            </td>
            <td>
              <div>{this.getType(propData)}</div>
            </td>
            <td>
              <code>
                {propData.defaultValue && propData.defaultValue.value}
              </code>
            </td>

            <td>
              {propData.doclets.deprecated && (
                <div>
                  <strong className="text-danger">
                    {'Deprecated: ' + propData.doclets.deprecated + ' '}
                  </strong>
                </div>
              )}
              <div
                dangerouslySetInnerHTML={{ __html: propData.descriptionHtml }}
              />
            </td>
          </tr>
        )
      })
  }

  renderRequiredLabel(prop) {
    if (!prop.required) {
      return null
    }

    return <Label>required</Label>
  }

  getType(prop) {
    let type = prop.type || {}
    let name = this.getDisplayTypeName(type.name)
    let doclets = prop.doclets || {}

    switch (name) {
      case 'object':
        return name
      case 'union':
        return type.value.reduce((current, val, i, list) => {
          let item = this.getType({ type: val })
          if (React.isValidElement(item)) {
            item = React.cloneElement(item, { key: i })
          }
          current = current.concat(item)

          return i === list.length - 1 ? current : current.concat(' | ')
        }, [])
      case 'array': {
        let child = this.getType({ type: type.value })

        return (
          <span>
            {'array<'}
            {child}
            {'>'}
          </span>
        )
      }
      case 'enum':
        return this.renderEnum(type)
      case 'custom':
        return cleanDocletValue(doclets.type || type.raw)
      default:
        return name
    }
  }

  getDisplayTypeName(typeName) {
    if (typeName === 'func') {
      return 'function'
    } else if (typeName === 'bool') {
      return 'boolean'
    } else {
      return typeName
    }
  }

  renderEnum(enumType) {
    const enumValues = enumType.value || []

    const renderedEnumValues = []
    enumValues.forEach(({ value }, i) => {
      if (i > 0) {
        renderedEnumValues.push(<span key={`${i}c`}>, </span>)
      }

      renderedEnumValues.push(<code key={i}>{value}</code>)
    })

    return <span>one of: {renderedEnumValues}</span>
  }
}

export default PropTable
