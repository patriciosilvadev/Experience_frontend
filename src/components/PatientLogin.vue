<template>
  <div class="login-patient" id="merda">
    <form class="login-patient__form">
      <div class="login-patient__radio-buttons" v-if="!softKeyboard">
        <code-group-radios :receive="valueRadio" @group="group">
          <template v-slot:header>
            <p class="login-patient__radios-title">Acessar como:</p>
          </template>
          <template v-slot:radios>
            <code-radio
              name="login"
              value="ID"
              label="Atendimento Único"
              @radio="radio"
              identifier="id"
              :visible="visibility"
            ></code-radio>
            <code-radio
              name="login"
              value="CPF"
              label="Histórico de Resultados"
              @radio="radio"
              identifier="cpf"
              :visible="visibility"
            ></code-radio>
          </template> 
        </code-group-radios>
      </div>
      <div class="login-patient__cpf" v-if="visibility !== 'ID'">
        <code-label
          bind="cpf"
          label="Cpf"
          color="#676a6c"
          :fontWeight="700"
          fontSize="0.8rem"
         ></code-label>
        <code-input
          placeholder="CPF"
          name="cpf"
          type="text"
          required
          v-model="cpf"
          :weight="500"
          color="#333"
          icon="user"
          :error="validate.cpf"
        />
      </div>
      <div class="login-patient__birthday" v-if="visibility !== 'ID'">
         <code-label
            bind="birthDay"
            label="Data nascimento"
            color="#676a6c"
            :fontWeight="700"
            fontSize="0.8rem"
         ></code-label>
         <code-calendar
            class="calendars__calendar"
            v-model="birthDay" 
            name="begin"
            icon="birthday-cake" 
            placeholder="data de nascimento"
            :error="validate.nascimento"
         />

      </div>
      <div class="login-patient__attendance" v-else>
        <code-label
          bind="idAttendance"
          label="Atendimento"
          color="#676a6c"
          :fontWeight="700"
          fontSize="0.8rem"
         ></code-label>
        <code-input
          ref="atendimento"
          placeholder="ID Atendimento"
          name="atendimento"
          type="text"
          required
          v-model="idAttendance"
          :focused="focusedInput == 'atendimento'"
          @focus="focusInput"
          :weight="600"
          color="#333"
          icon="user"
          :error="validate.atendimento"
        />
      </div>
      <div class="login-patient__password">
        <code-label
          bind="patient-password"
          label="Senha"
          color="#676a6c"
          :fontWeight="700"
          fontSize="0.8rem"
        ></code-label>
        <code-input-password
          ref="senha"
          name="senha"
          id="patient-password"
          icon="lock"
          @focus="focusInput"
          v-model="password"
          :focused="focusedInput == 'senha'"
          :error="validate.senha"
        />
      </div>
      <div class="login-patient__actions">
        <small class="login-patient__keyboard">
          <i v-if="visibility === 'ID'" @click="displayKeyboard" class="keyboard__icon">
            <font-awesome-icon icon="keyboard" size="lg"/>
          </i>
        </small>
        <code-tooltip
          text="Clique aqui"
        >
          <template>
            <small class="login-patient__doubt" @click="displayHelpToLogin">duvidas <i><font-awesome-icon icon="question-circle"/></i></small>
          </template>
        </code-tooltip> 
      </div>
      <div class="login-patient__buttons">
        <code-button
          text="acessar"
          borded
          bolded
          letters="uppercase"
          color="theme"
          size="md"
          shading
          streched
          size-icon="lg"
          :loading="showLoader"
          velocity-loading="1x"
          @click.prevent="confirm"
          :disabled="authState == 'loading'"
        ></code-button>
      </div>
    </form>
    <div class="login-patient__softkeyboard">
      <keyboard-self-service
        @write="write"
        @nextInput="nextInput"
        @previousInput="previousInput"
        @confirm="confirm"
        @backspace="backspace"
        @right="goRight"
        @left="goLeft"
        @space="space"
        :show="softKeyboard"
        :input="inputKeyboard"
        @close="hiddenSoftKeyboard" 
      />  
    </div>
  </div>
</template>
<script>
import CodeInput from './base/CodeInput'
import CodeButton from './base/CodeButton'
import CodeCalendar from './base/CodeCalendar'
import CodeLabel from './base/CodeLabel'
import CodeRadio from './base/CodeRadio'
import CodeTooltip from './base/CodeTooltip'
import CodeGroupRadios from './base/CodeGroupRadios'
import CodeInputPassword from './base/CodeInputPassword'
import keyboardSelfService from './KeyboardSelfService'
import { required, min, date, cpfValide } from '../mixins/validations/rules'
import { validator } from '../mixins/validations/validator'
import { cpf, identifier } from '../mixins/masks'
import { login } from '../mixins/login';
import {
  NAMESPACED_AUTH, 
  AUTH_REQUEST, 
  ATTENDANCE_AUTH,
  PATIENT_AUTH,
  PATIENT_TYPE, 
  PATIENT_ROUTE, 
  REQUIRED_INPUT,
  INCOMPLETE_ID,
  INCOMPLETE_CPF,
  INVALID_DATA
} from '../utils/alias'
import { mapActions } from 'vuex'
export default {
  name: 'LoginPatient',
  mixins: [validator({required, min, date, cpfValide }), cpf, identifier, login],
  props: {
    digit: String
  },
  components: {
    CodeButton,
    CodeInput,
    CodeCalendar,
    CodeLabel,
    CodeRadio,
    CodeTooltip,
    CodeGroupRadios,
    CodeInputPassword,
    keyboardSelfService
  },
  data () {
    return {
      patient: {
        cpf: '',
        nascimento: '',
        atendimento: '',
        posto: '',
        senha: ''
      },
      code: '',
      validate: {
        cpf: '',
        nascimento: '',
        atendimento: '',
        posto: '',
        senha: ''
      },
      receive: '',
      valueRadio: '',
      visibility: 'ID',
      softKeyboard: false,
      inputKeyboard: '',
      focusInputList: [],
      indexFocusedInput: 0,
      focusedInput: '',
      caretPosition: 0,
      keyboardActive: false,
      focusedElement: null
    }
  },
  created () {
    
    this.focusInputList = ['atendimento', 'senha']
  },
  mounted () {
    this.focusedInput = 'atendimento'
  },
  computed: {
    cpf: {
      get () {
        return this.patient.cpf
      },
      set (value) {
        this.patient.cpf = value
      }
    },
    identifier: {
      get () {
        return this.code
      },
      set (value) {
        this.code = value
      }
    },
    birthDay: {
      get () {
        return this.patient.nascimento
      },
      set (value) {
        this.patient.nascimento = this.formatterDate(value)
      }
    },
    idAttendance: {
      get () {
        return this.code
      },
      set (value) {
        let arrIdentifier = this.splitIdAttendance(value)
        this.attendance = arrIdentifier[1]
        this.healthCenter = this.getNumberHealthCenter(arrIdentifier[0])
        this.code = value
      }
    },
    attendance: {
      get () {
        return this.patient.atendimento
      },
      set (value) {
        this.patient.atendimento = value
      }
    },
    healthCenter: {
      get () {
        return this.patient.posto
      },
      set (value) {
        this.patient.posto = value
      }
    },
    password: {
      get () {
        return this.patient.senha
      },
      set (value) {
        this.patient.senha = value
      }
    },
    getCredentials () {
      let { patient } = this
      if (this.visibility === 'CPF') {
        return Object.assign({cpf: patient.cpf.replace(/\s/g, ''), nascimento: patient.nascimento.replace(/\s/g, ''), senha: patient.senha})
      }
      return Object.assign({atendimento: patient.atendimento, posto: patient.posto, senha: patient.senha})
    },
    validator () {
      if (this.visibility === 'CPF') {
        return (this.validate.cpf !== '' || this.validate.nascimento !== '' || this.validate.senha !== '')
      }
      return (  
        this.validate.atendimento !== '' || 
        this.validate.posto !== '' ||
        this.validate.senha !== ''
      )
    },
  },
  watch: {
    
    visibility () {

      this.patient.cpf = ''
      this.patient.nascimento = ''
      this.idAttendance = ''
      this.patient.posto = ''
      //this.patient.senha = ''

      this.validate.cpf = ''
      this.validate.nascimento = ''
      this.validate.atendimento = ''
      this.validate.posto = ''
      this.validate.senha = ''

    },
    softKeyboard (value) {

      if (!value) {
        this.focusedInput = ''
      }
    },
    cpf (value) {
      console.log(value)
      if (this.required(value)) {
        this.validate.cpf = REQUIRED_INPUT
        //eslint-disable-next-line
      } else if (this.cpfValide(value, /[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/g)){
        this.validate.cpf = INCOMPLETE_CPF
      } else {
        this.validate.cpf = ''
      }
    },
    birthDay (value) {
      console.log(value)
      if (this.required(value)) {
        this.validate.nascimento = REQUIRED_INPUT
        //eslint-disable-next-line
      } else if (this.date(value, /[0-9]{2}\/[0-9]{2}\/[0-9]{4}/g)){
        this.validate.nascimento = INVALID_DATA
      } else {
        this.validate.nascimento = ''
      }
    },
    idAttendance (value) {
      if (this.required(value)) {
        this.validate.atendimento = REQUIRED_INPUT
      } else if (this.min(value, 11)) {
        this.validate.atendimento = INCOMPLETE_ID
      } else {
        this.validate.atendimento = ''
      }
    },
    password (value) {
      if (this.required(value)) {
        this.validate.senha = REQUIRED_INPUT
      } else {
        this.validate.senha = ''
      } 
    }
  },
  methods: {
    ...mapActions (NAMESPACED_AUTH, {
      login: AUTH_REQUEST
    }),
    hiddenSoftKeyboard () {

      this.softKeyboard = false
      this.keyboardActive = false
      this.$emit('keyboardActivated', this.keyboardActive)
    },
    inputModel (e) {

      this.patient.atendimento = e.target.value
    },
    nextInput () {

      let numInputs = this.focusInputList.length
      this.indexFocusedInput = (++this.indexFocusedInput)%numInputs
      this.focusedInput = this.focusInputList[this.indexFocusedInput]
    },
    previousInput () {

      let numInputs = this.focusInputList.length
      this.indexFocusedInput = -(--this.indexFocusedInput)%numInputs
      this.focusedInput = this.focusInputList[this.indexFocusedInput]
    },

    validateAllFields () {
      let fields = Object.keys(this.patient).filter(el => {

        return this.patient[el] === ''
      })

      if (this.visibility == 'CPF') {
   
        fields = fields.filter(el => el == 'cpf' || el == 'nascimento' || el == 'senha')
      } else {
        fields = fields.filter(el => !(el == 'cpf' || el == 'nascimento'))
      }

      fields.forEach(element => {
        this.validate[element] = REQUIRED_INPUT
      })
      return fields.length > 0
    },
    confirm (e) {
      
      e.preventDefault()

      let emptyFieldAll = this.validateAllFields()

      if (!emptyFieldAll && this.authState !== 'loading' && !this.validator) {
        
        this.realizeLogin ()
        return
      }
      if (emptyFieldAll || this.validator) {
        this.emitMessage({status: 111})
      }

    },
    splitIdAttendance (idAttendance) {
      return idAttendance.split('/').map(item => item.trim())
    },
    getNumberHealthCenter (healthCenter) {
      return healthCenter.replace(/^[0]{1,2}/g, '')
    },
    formatterDate (date) {
      return date.replace(/\s/g, '')
    },
    realizeLogin () {
      this.showLoader = true
      this.$emit('loading', true)

      this.login({ 
          url: (this.visibility === 'CPF') ? PATIENT_AUTH : ATTENDANCE_AUTH,
          uniqueAttendance: !(this.visibility === 'CPF'),
          credentials: this.getCredentials,
          typeUser: PATIENT_TYPE
        })
        .then((resp) => {
          this.success(resp.status, PATIENT_ROUTE)
        })
        .catch((err) => {
          let refused = err.message == 'Network Error' ? 502 : undefined
          let options = {
            status: refused || err.response.status
          }
          this.error(options) 
          this.$emit('loading', false)
        })
        
    },
    
    backspace () {

      const caretPosition = this.getCaretPosition()
     
      let currentValue = (this.indexFocusedInput === 0)? this.idAttendance : this.patient[this.focusInputList[this.indexFocusedInput]];
      const newValue = this.deleteChar(currentValue, caretPosition - 1);
      if (this.indexFocusedInput === 0) {
        this.idAttendance = newValue
      } else {
        this.patient[this.focusInputList[this.indexFocusedInput]] = newValue;
      }
      
      this.updateCurrentInput(newValue);
      let inputElement = this.focusedElement;
      this.setCaretPosition(inputElement, caretPosition - 1);
    },
    deleteChar (str, pos) {

      let arrStr = str.split('');
      arrStr[pos] = '';
      return arrStr.join('');
    },
    insertChar (str, pos, char) {
      console.log(str)
      return str.substr(0, pos) + char + str.substr(pos, str.length)
    },
    getCaretPosition () {

      let el = this.focusedElement;
      if (el.selectionStart) {
        return el.selectionStart;
      } else if (document.selection) {
        el.focus();
        var r =  document.selection.createRange();
        if (r == null) {
          return 0;
        }

        let rangeElement = el.target.createTextRange(),
            rangeCopy = rangeElement.duplicate();
        rangeElement.moveToBookmark(r.getBookmark());
        rangeCopy.setEndPoint('EndToStart', rangeElement);

        return rangeCopy.text.length;
      }
      return 0
    },
    updateCurrentInput (newValue) {

      this.focusedElement.value = newValue;
    },
    goRight () {

      this.caretPosition = this.getCaretPosition()
      let positionRightLimit = this.patient[this.focusedInput].length;
      let inputElement = this.focusedElement
      if (this.caretPosition < positionRightLimit) {
        this.caretPosition++; 
      }
      this.setCaretPosition(inputElement, this.caretPosition);

    },
    goLeft () {

      this.caretPosition = this.getCaretPosition()
      let positionLeftLimit = 0
      let inputElement = this.focusedElement
     
      if (this.caretPosition > positionLeftLimit) {
        this.caretPosition--;
      }
      this.setCaretPosition(inputElement, this.caretPosition)
    },
    space () {

      let e = Object.assign({ target: { value: ' ' } })
      this.write(e)
    },
    setCaretPosition (el, pos) {

      if (el.setSelectionRange) {  
        el.focus();
        el.setSelectionRange(pos,pos);
      } else if (el.createTextRange) {
        var range = el.createTextRange();
        range.moveStart('Character', pos);
        range.select();
      }
    },
    write (e) {
 
      this.indexFocusedInput = this.focusInputList.indexOf(this.focusedInput)
      let currentPositionCursor = this.getCaretPosition()
      if (this.focusedInput === 'atendimento') {
        this.idAttendance = this.insertChar(this.idAttendance, currentPositionCursor, e.target.value);
      } else {
        this.patient[this.focusedInput] = this.insertChar(this.patient[this.focusedInput], currentPositionCursor, e.target.value);
      }
      this.updateCurrentInput(this.patient[this.focusedInput])
      let inputElement = this.focusedElement
      this.setCaretPosition(inputElement, currentPositionCursor + 1)
    },
    focusInput (e) {
      console.log(e.target.name)
      this.focusedElement = e.target
      console.log(this.focusInputList.indexOf(e.target.name))
      this.indexFocusedInput = this.focusInputList.indexOf(e.target.name);
      this.focusedInput = e.target.name;
    },
    radio (value) {

      this.valueRadio = value
    },
    group (value) {
      this.visibility = value
    },
    displayKeyboard () {
     
      this.focusedInput = this.focusInputList[this.indexFocusedInput]
      console.log(this.focusedInput)
      this.softKeyboard = !this.softKeyboard
      if (this.softKeyboard) {
        //this.$refs[this.focusedInput].$el.focus();
        //console.log( this.$refs[this.focusedInput])
        this.focusedInput = 'atendimento'
      }
      this.keyboardActive = !this.keyboardActive
      this.$emit('keyboardActivated', this.keyboardActive)
    },
    displayHelpToLogin () {

      this.$emit('modalHelp', true)
    }
  }  
}
</script>
<style lang="sass" scoped>
.login-patient
  width: 100%
.login-patient__form
  display: flex
  flex-direction: column
  padding: 20px
.login-patient__softkeyboard
  width: 100%
  align-self: flex-start
.login-patient__attendance,
.login-patient__password,
.login-patient__cpf,
.login-patient__birthday
  margin: 7px 0
.login-patient__buttons
  display: flex
  flex-direction: row
  width: 100%
.radio-input
  width: 100%
.login-patient__radio-buttons
  margin-bottom: 20px
.login-patient__actions
  display: flex
  flex-direction: row
  justify-content: space-between
  align-items: baseline
.login-patient__keyboard,
.login-patient__doubt
  color: rgb(52, 181, 131)
  margin: 20px 0
  cursor: pointer
.login-patient__doubt:hover
  text-decoration: underline
.keyboard__icon
  @include respond-to(handhelds)
    display: none
.login-patient__radios-title
  margin: 7px 0
  padding: 0
  font-weight: 600
  font-size: 0.80rem
  color: #676a6c
</style>