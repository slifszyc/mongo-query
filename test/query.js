
var query = require('..');
var expect = require('expect.js');

describe('query', function(){

  describe('helpers', function(){
    it('should expose #get', function(){
      expect(query.get({ a: { b: 'c' } }, 'a.b')).to.be('c');
    });

    it('should expose #set', function(){
      var obj = { a: 'b', c: { d: 'e' } };
      expect(query.get(obj, 'c.f')).to.be(undefined);
      query.set(obj, 'c.f', 'g');
      expect(query.get(obj, 'c.f')).to.be('g');
    });

    it('should expose filtering api', function(){
      var flt = query.filter({ 'c.f': 'g' });
      expect(flt.test({ e: { d: '' } })).to.eql([]);
      expect(flt.test({ c: { f: '' } })).to.eql([]);
      expect(flt.test([{ c: { f: 'g' } }])).to.eql([{ c: { f: 'g' } }]);
      expect(flt.test({ c: { f: 'g' } }, {
        type: 'single'
      })).to.eql(true);
    });

    it('should produce a empty changeset upon no match', function(){
      expect(query({}, {}, {})).to.eql([]);
      expect(query({ a: 'b' }, {}, {})).to.eql([]);
      expect(query({ a: 'b' }, { c: 'd' }, {})).to.eql([]);
    });
  });

  describe('$set', function(){
    it('should $set simple key', function(){
      var obj = { a: 'b' };
      var ret = query(obj, {}, { $set: { a: 'c' } });
      expect(obj.a).to.be('c');
    });

    it('should $set nested', function(){
      var obj = { a: { b: 'c' } };
      var ret = query(obj, {}, { $set: { 'a.b': 'e' } });
      expect(obj.a.b).to.be('e');
    });

    it('should initialize nested', function(){
      var obj = {};
      var ret = query(obj, {}, { $set: { 'a.b.c': 'd' } });
      expect(obj.a.b.c).to.be('d');
    });
  });

});