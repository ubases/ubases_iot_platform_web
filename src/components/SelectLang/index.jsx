import './index.less'
import { Icon, Menu, Dropdown } from 'ant-design-vue'
import i18nMixin from '@/store/i18n-mixin'

// const locales = ['zh-CN', 'zh-TW', 'en-US', 'pt-BR']
const locales = ['zh-CN', 'en-US']
const showlanguageLabels = {
  'zh': '中文(简体)',
  'en': 'English'
}

const languageLabels = {
  'zh-CN': '中文(简体)',
  'en-US': 'English'
}

// eslint-disable-next-line
const languageIcons = {
  'zh-CN': '🇨🇳',
  'en-US': 'en',
}

const SelectLang = {
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-drop-down'
    },
    languageLabels: {
      type: Array,
      default() {
        return []
      }
    }
  },
  name: 'SelectLang',
  mixins: [i18nMixin],
  data() {
    return {
      currentLangLocal: ''
    }
  },
  render() {
    const { prefixCls } = this
    const changeLang = ({ key }) => {
      this.setLang(key, languageIcons[key])
      this.$router.go(0)
    }
    const langMenu = (
      <Menu class={['menu', 'ant-pro-header-menu']} selectedKeys={[this.currentLang]} onClick={changeLang}>
        {locales.map(locale => (
          <Menu.Item key={locale}>
            <span role="img" aria-label={languageLabels[locale]}>
              {languageIcons[locale]}
            </span>{' '}
            {languageLabels[locale]}
          </Menu.Item>
        ))}
      </Menu>
    )
    return (
      <Dropdown overlay={langMenu} placement="bottomRight">
        <span class={prefixCls}>
          <span style="margin-left:2px;color: #fff;">{showlanguageLabels[this.currentLang]}</span>{ ' ' }
          <Icon type="down" fill="" style="vertical-align:middle;color: #fff;"/>
        </span>
      </Dropdown>
    )
  }
}

export default SelectLang
