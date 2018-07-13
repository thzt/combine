### combine

`combine`提供了一个校验框架，

将一个React组件`Comp`，与它的校验函数`checkValue`结合在一起，

包装成一个自带校验功能的组件。

<br/>

```
export default combine(Comp, checkValue);
```

<br/>

### Comp

`Comp`是一个React组件，`combine`将校验功能与之分离，

当触发父组件传入的onChange属性时，自动触发校验，

而校验结果，通过validation属性传入。

<br/>

```
class Comp extends React.Component {
    state = {
        value: this.props.value,
    };

    onChange = async v => {
        const {
            props: {onChange},
        }=this;

        // ... 省略的业务逻辑

        // 1. 自动触发当前组件的校验
        await onChange(v);
    };

    // 2. 必填
    componentWillReceiveProps = nextProps => this.setState(nextProps);

    render = ()=>{
        const {
            state: {value},

            // 3. 自动携带validation属性，和triggerValidation属性
            props: {validation: {isPass, message}, triggerValidation},

            onChange,
        }=this;
    };

    return (
        // 组件内容示例

        // 4. 需要透传triggerValidation
        <Ele value={value} onChange={onChange} triggerValidation={triggerValidation} />
        <span>{isPass?null:message}</span>
    );
}
```

<br/>

注意事项汇总：

<br/>

（1）一般而言，在React中，组件的onChange事件需要这样编写，

组件内容触发的onChange，经过处理后会，调用父组件传入的onChange。

<br/>

以上代码，`await onChange(v);`，由框架提供，会自动对`v`进行校验，

如果通过了校验，则触发组件的onChange事件，否则不触发。

<br/>

（2）componentWillReceiveProps是必填的

<br/>

（3）`validation`属性，表示当前组件的校验结果，由框架提供，

用于展示错误提示消息。

<br/>

（4）组件内容中，需要透传`triggerValidation`到子组件中，

用于由最高层组件手动触发整个组件体系的校验。

<br/>

### checkValue

`checkValue`用于完成当前组件的校验，为了兼容异步写法，它是一个async函数，

它的函数签名如下，`checkValue :: async v -> {isPass, message}`，

即，`checkValue`接受组件的值作为参数，返回一个形如`{isPass, message}`的object。

<br/>

其中，`isPass`表示校验是否通过，`message`表示校验相关的结果信息。

<br/>

### 使用方式

```
const V = combine(Comp, checkValue);
```

<br/>

使用`combine`，我们可以将`Comp`组件与`checkValue`函数结合起来，得到一个新组件`V`。

这个新组件`V`自包含校验功能。

<br/>

我们来看`V`的使用方式，

```
<V value={value} onChange={onChange} triggerValidation={triggerValidation}/>
```

<br/>

其中，onChange事件本来应该返回组件的值，

由于使用了`combine`，onChange事件会多返回一个`isPass`，即，

<br/>

```
onChange = async (value, isPass) =>{
    // ... 省略的业务逻辑
};
```

<br/>

### 由最高层组件触发校验

在编写表单组件的时候，会经常遇到这样一种场景，

点击提交按钮，应当触发整个表单进行校验，

根据React的单向数据流机制，这种校验方式不得不由最外层进行触发。

<br/>

```
class Page extends React.Component {
    state = {
        value: null,
        triggerValidation: false,
    };

    onClick = ()=>{

        // 1. 通过设置triggerValidation为true，手动触发校验
        this.setState({
            triggerValidation: true,
        });
    };

    onChange = async (value, isPass) =>{
        // ... 省略的业务逻辑

        // 2. 必须重置triggerValidation为false
        this.setState({
            triggerValidation: false,
        });
    };

    render = ()=>{
        const {
            state: {triggerValidation, value},

            onClick, onChange, 
        }=this;

        return (
            <div>
                <V value={value} onChange={onChange} triggerValidation={triggerValidation} />
                <input type="button" onClick={onClick} value="click" />
            </div>
        );
    };
}
```

<br/>

注意事项汇总：

<br/>

（1）以上代码中，在onClick函数中，通过设置`triggerValidation`为`true`，自动触发整个组件体系的校验。

为此，我们需要将`triggerValidation`透传到子组件`V`中。

<br/>

（2）onChange是整个组件体系校验完毕后进行的回调，上文中我们提到了它额外携带了`isPass`参数，

在onChange中，我们要重置triggerValidation为false。
